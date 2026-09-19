import { describe, it, expect } from 'vitest';
import { filterTasks } from '../../src/lib/filters';
import type { Task, TaskFilters } from '../../src/types/task';

describe('Filter and Search Logic (filterTasks)', () => {
  const sampleTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Finish Project documentation',
      priority: 'high',
      completed: false,
      createdAt: '2026-09-19T08:00:00.000Z',
      updatedAt: '2026-09-19T08:00:00.000Z',
    },
    {
      id: 'task-2',
      title: 'Review pull request',
      priority: 'medium',
      completed: true,
      createdAt: '2026-09-19T08:10:00.000Z',
      updatedAt: '2026-09-19T08:10:00.000Z',
    },
    {
      id: 'task-3',
      title: 'Deploy project to staging',
      priority: 'high',
      completed: true,
      createdAt: '2026-09-19T08:20:00.000Z',
      updatedAt: '2026-09-19T08:20:00.000Z',
    },
    {
      id: 'task-4',
      title: 'Team standup meeting',
      priority: 'low',
      completed: false,
      createdAt: '2026-09-19T08:30:00.000Z',
      updatedAt: '2026-09-19T08:30:00.000Z',
    },
  ];

  const defaultFilters: TaskFilters = {
    search: '',
    status: 'all',
    priority: 'all',
  };

  describe('Search by Title', () => {
    it('returns all tasks when search query is empty', () => {
      const results = filterTasks(sampleTasks, defaultFilters);
      expect(results).toHaveLength(4);
    });

    it('returns all tasks when search query is whitespace only', () => {
      const results = filterTasks(sampleTasks, { ...defaultFilters, search: '   \t  ' });
      expect(results).toHaveLength(4);
    });

    it('matches task title substring', () => {
      const results = filterTasks(sampleTasks, { ...defaultFilters, search: 'standup' });
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('task-4');
    });

    it('performs case-insensitive search', () => {
      const lowerResults = filterTasks(sampleTasks, { ...defaultFilters, search: 'project' });
      const upperResults = filterTasks(sampleTasks, { ...defaultFilters, search: 'PROJECT' });
      const mixedResults = filterTasks(sampleTasks, { ...defaultFilters, search: 'pRoJeCt' });

      expect(lowerResults).toHaveLength(2);
      expect(upperResults).toHaveLength(2);
      expect(mixedResults).toHaveLength(2);
      expect(lowerResults.map((t) => t.id)).toEqual(['task-1', 'task-3']);
    });

    it('trims leading and trailing whitespace from search query', () => {
      const results = filterTasks(sampleTasks, { ...defaultFilters, search: '  project  ' });
      expect(results).toHaveLength(2);
    });

    it('returns empty array when search query has no matches', () => {
      const results = filterTasks(sampleTasks, { ...defaultFilters, search: 'nonexistent keyword' });
      expect(results).toHaveLength(0);
    });
  });

  describe('Status Filtering', () => {
    it('returns all tasks when status is "all"', () => {
      const results = filterTasks(sampleTasks, { ...defaultFilters, status: 'all' });
      expect(results).toHaveLength(4);
    });

    it('returns only active (uncompleted) tasks when status is "active"', () => {
      const results = filterTasks(sampleTasks, { ...defaultFilters, status: 'active' });
      expect(results).toHaveLength(2);
      expect(results.every((t) => !t.completed)).toBe(true);
      expect(results.map((t) => t.id)).toEqual(['task-1', 'task-4']);
    });

    it('returns only completed tasks when status is "completed"', () => {
      const results = filterTasks(sampleTasks, { ...defaultFilters, status: 'completed' });
      expect(results).toHaveLength(2);
      expect(results.every((t) => t.completed)).toBe(true);
      expect(results.map((t) => t.id)).toEqual(['task-2', 'task-3']);
    });
  });

  describe('Priority Filtering', () => {
    it('returns all tasks when priority is "all"', () => {
      const results = filterTasks(sampleTasks, { ...defaultFilters, priority: 'all' });
      expect(results).toHaveLength(4);
    });

    it('returns only high priority tasks', () => {
      const results = filterTasks(sampleTasks, { ...defaultFilters, priority: 'high' });
      expect(results).toHaveLength(2);
      expect(results.every((t) => t.priority === 'high')).toBe(true);
      expect(results.map((t) => t.id)).toEqual(['task-1', 'task-3']);
    });

    it('returns only medium priority tasks', () => {
      const results = filterTasks(sampleTasks, { ...defaultFilters, priority: 'medium' });
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('task-2');
    });

    it('returns only low priority tasks', () => {
      const results = filterTasks(sampleTasks, { ...defaultFilters, priority: 'low' });
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('task-4');
    });
  });

  describe('Combined Filtering', () => {
    it('combines search and status correctly', () => {
      // Search 'project', Status 'active' -> task-1 (task-3 is completed)
      const results = filterTasks(sampleTasks, {
        search: 'project',
        status: 'active',
        priority: 'all',
      });
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('task-1');
    });

    it('combines search and priority correctly', () => {
      // Search 'project', Priority 'high' -> task-1 and task-3
      const results = filterTasks(sampleTasks, {
        search: 'project',
        status: 'all',
        priority: 'high',
      });
      expect(results).toHaveLength(2);

      // Search 'project', Priority 'low' -> 0 results
      const noResults = filterTasks(sampleTasks, {
        search: 'project',
        status: 'all',
        priority: 'low',
      });
      expect(noResults).toHaveLength(0);
    });

    it('combines status and priority correctly', () => {
      // Status 'completed', Priority 'high' -> task-3
      const results = filterTasks(sampleTasks, {
        search: '',
        status: 'completed',
        priority: 'high',
      });
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('task-3');
    });

    it('combines search, status, and priority simultaneously', () => {
      // Search 'project', Status 'completed', Priority 'high' -> task-3
      const results = filterTasks(sampleTasks, {
        search: 'project',
        status: 'completed',
        priority: 'high',
      });
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('task-3');

      // Search 'project', Status 'completed', Priority 'medium' -> 0 matches
      const emptyResults = filterTasks(sampleTasks, {
        search: 'project',
        status: 'completed',
        priority: 'medium',
      });
      expect(emptyResults).toHaveLength(0);
    });

    it('does not mutate the original tasks array or task objects', () => {
      const originalCopy = JSON.parse(JSON.stringify(sampleTasks));
      filterTasks(sampleTasks, {
        search: 'project',
        status: 'active',
        priority: 'high',
      });
      expect(sampleTasks).toEqual(originalCopy);
    });
  });
});
