const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 40 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain character']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Tour difficulty need to be easy, medium, or difficult'
      }
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        // THIS ONLY WORKS ON CREATE AND SAVE
        validator: function(value) {
          return value < this.price;
        },
        message: 'The discount ({VALUE}) should be lower than regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    description: {
      type: String,
      trim: true
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
  const durInWeeks = this.duration < 7 ? 0 : Math.floor(+this.duration / 7);
  const daysLeft = this.duration % 7;
  return `${
    durInWeeks !== 0 ? durInWeeks : ''
  } ${durInWeeks === 0 ? '' : 'week'} ${daysLeft === 0 ? '' : 'and'} ${daysLeft === 0 ? '' : daysLeft} ${daysLeft === 0 ? '' : 'days'}`;
});

// virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// EMBEDING GUIDES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE

// This always points to query
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`query took ${Date.now() - this.start} miliseconds!!!`);
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  // console.log(this.pipeline()[0].$geoNear);
  if (this.pipeline()[0].$geoNear) {
    next();
  } else {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log(this.pipeline(), 'ETO TI GA PIPELINE 🤣');
    next();
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
