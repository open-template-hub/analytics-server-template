/**
 * @description holds event routes
 */

import {
  authorizedBy,
  ResponseCode,
  UserRole,
} from '@open-template-hub/common';
import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { EventController } from '../controller/event.controller';
import { EventFilter } from '../interface/event-filter.interface';
import { Event } from '../interface/event.interface';

const subRoutes = {
  root: '/',
  categories: '/categories'
};

export const router = Router();

const eventController = new EventController();

router.post(
  subRoutes.root,
  authorizedBy([UserRole.ADMIN, UserRole.DEFAULT]),
  async (req: Request, res: Response) => {
    // Create new Event
    let event = await eventController.createEvent(res.locals.ctx, {
      source: req.body.source,
      category: req.body.category,
      timestamp: req.body.timestamp,
      payload: req.body.payload,
    } as Event);
    res.status(ResponseCode.CREATED).json(event);
  }
);

router.get(
  subRoutes.root,
  authorizedBy([UserRole.ADMIN, UserRole.DEFAULT]),
  async (req: Request, res: Response) => {
    // Filter Events
    let events = await eventController.filterEvents(res.locals.ctx, {
      name: req.query.name,
      category: req.query.category,
      start: parseInt(req.query.start as string),
      end: parseInt(req.query.end as string),
      skip: req.query.skip ? +req.query.skip : 0,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      reporter: req.query.reporter,
    } as EventFilter);
    res.status(ResponseCode.OK).json(events);
  }
);

router.get(
  subRoutes.categories,
  authorizedBy([UserRole.ADMIN, UserRole.DEFAULT]),
  async(req: Request, res: Response) => {
    let categoriesResponse = await eventController.getCategories(
      res.locals.ctx,
      req.query.language as string
    )
    res.status(ResponseCode.OK).json(categoriesResponse);
  }
);
