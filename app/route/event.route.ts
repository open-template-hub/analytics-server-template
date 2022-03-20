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
import { EventCategory } from '../enum/event-category.enum';
import { EventFilter } from '../interface/event-filter.interface';
import { Event } from '../interface/event.interface';

const subRoutes = {
  root: '/',
  categories: '/config'
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
      category: EventCategory[req.body.category as EventCategory],
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
      category: EventCategory[req.query.category as EventCategory],
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
    let categoryConfig = await eventController.getCategoryConfig(
      res.locals.ctx
    )
    res.status(ResponseCode.OK).json(categoryConfig);
  }
);
