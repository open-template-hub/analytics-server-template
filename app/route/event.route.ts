/**
 * @description holds event routes
 */

import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { ResponseCode, Context } from '@open-template-hub/common';
import { EventController } from '../controller/event.controller';
import { Event } from '../interface/event.interface';
import { EventCategory } from '../enum/event-category.enum';
import { EventFilter } from '../interface/event-filter.interface';

const subRoutes = {
  root: '/',
};

export const router = Router();

export const adminRoutes = [subRoutes.root];

const eventController = new EventController();

router.post(subRoutes.root, async (req: Request, res: Response) => {
  // Create new Event
  let event = await eventController.createEvent(
    res.locals.ctx as Context,
    {
      name: req.body.name,
      category: EventCategory[req.body.category as EventCategory],
      timestamp: req.body.timestamp,
      payload: req.body.payload,
    } as Event
  );
  res.status(ResponseCode.CREATED).json(event);
});

router.get(subRoutes.root, async (req: Request, res: Response) => {
  // Filter Events
  let events = await eventController.filterEvents(
    res.locals.ctx as Context,
    {
      name: req.query.name,
      category: EventCategory[req.query.category as EventCategory],
      start: parseInt(req.query.start as string),
      end: parseInt(req.query.end as string),
      limit: parseInt(req.query.limit as string),
      reporter: req.query.reporter,
    } as EventFilter
  );
  res.status(ResponseCode.OK).json(events);
});
