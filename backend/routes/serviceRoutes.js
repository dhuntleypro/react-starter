import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Service from '../models/serviceModel.js';
import { isAuth, isAdmin } from '../utils.js';

const serviceRouter = express.Router();

serviceRouter.get('/', async (req, res) => {
  const services = await Service.find();
  res.send(services);
});

serviceRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newService = new Service({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const service = await newService.save();
    res.send({ message: 'Service Created', service });
  })
);

serviceRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (service) {
      service.name = req.body.name;
      service.slug = req.body.slug;
      service.price = req.body.price;
      service.image = req.body.image;
      service.images = req.body.images;
      service.category = req.body.category;
      service.brand = req.body.brand;
      service.countInStock = req.body.countInStock;
      service.description = req.body.description;

      await service.save();
      res.send({ message: 'Service Updated' });
    } else {
      res.status(404).send({ message: 'Service Not Found' });
    }
  })
);

serviceRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (service) {
      await service.remove();
      res.send({ message: 'Service Deleted' });
    } else {
      res.status(404).send({ message: 'Service Not Found' });
    }
  })
);

serviceRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (service) {
      if (service.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      service.reviews.push(review);
      service.numReviews = service.reviews.length;
      service.rating =
        service.reviews.reduce((a, c) => c.rating + a, 0) /
        service.reviews.length;
      const updatedService = await service.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedService.reviews[updatedService.reviews.length - 1],
        numReviews: service.numReviews,
        rating: service.rating,
      });
    } else {
      res.status(404).send({ message: 'Service Not Found' });
    }
  })
);

const PAGE_SIZE = 3;

serviceRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const services = await Service.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countServices = await Service.countDocuments();
    res.send({
      services,
      countServices,
      page,
      pages: Math.ceil(countServices / pageSize),
    });
  })
);

serviceRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const services = await Service.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countServices = await Service.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      services,
      countServices,
      page,
      pages: Math.ceil(countServices / pageSize),
    });
  })
);

serviceRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Service.find().distinct('category');
    res.send(categories);
  })
);

serviceRouter.get('/slug/:slug', async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug });
  if (service) {
    res.send(service);
  } else {
    res.status(404).send({ message: 'Service Not Found' });
  }
});
serviceRouter.get('/:id', async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (service) {
    res.send(service);
  } else {
    res.status(404).send({ message: 'Service Not Found' });
  }
});

export default serviceRouter;
