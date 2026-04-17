import { Task } from '../types'
import { format, addDays, subDays } from 'date-fns'

const today = format(new Date(), 'yyyy-MM-dd')
const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')
const dayAfter = format(addDays(new Date(), 2), 'yyyy-MM-dd')
const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
const nextWeek = format(addDays(new Date(), 6), 'yyyy-MM-dd')

export const seedTasks: Task[] = [
  {
    id: 'seed-1',
    title: 'Review lecture notes for CSCE 436 midterm',
    category: 'study',
    priority: 'high',
    dueDate: today,
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    completedAt: null,
  },
  {
    id: 'seed-2',
    title: 'Submit HCI prototype writeup',
    category: 'study',
    priority: 'high',
    dueDate: tomorrow,
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    completedAt: null,
  },
  {
    id: 'seed-3',
    title: '30-minute walk or workout',
    category: 'health',
    priority: 'medium',
    dueDate: today,
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    completedAt: null,
  },
  {
    id: 'seed-4',
    title: 'Email professor about office hours',
    category: 'study',
    priority: 'medium',
    dueDate: tomorrow,
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    completedAt: null,
  },
  {
    id: 'seed-5',
    title: 'Grocery shopping',
    category: 'personal',
    priority: 'low',
    dueDate: dayAfter,
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    completedAt: null,
  },
  {
    id: 'seed-6',
    title: 'Read two chapters of Operating Systems textbook',
    category: 'study',
    priority: 'medium',
    dueDate: nextWeek,
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    completedAt: null,
  },
  {
    id: 'seed-7',
    title: 'Call home',
    category: 'personal',
    priority: 'medium',
    dueDate: today,
    completed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'seed-8',
    title: 'Complete lab report for ECEN 220',
    category: 'study',
    priority: 'high',
    dueDate: yesterday,
    completed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
]
