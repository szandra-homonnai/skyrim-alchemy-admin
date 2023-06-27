import { Component, EventEmitter } from '@angular/core';

/**
 * Based on: https://github.com/cnunciato/ng-mock-component
 */

/**
 * @example
 * MockComponent({ selector: 'component-a' });
 * MockComponent({ selector: 'component-b', inputs: [ 'input1', 'input2' ] });
 */
export function MockComponent(options: Component): Component {
  class Mock { }

  const metadata: Component = { ...options };
  metadata.template = metadata.template || '';
  metadata.inputs = metadata.inputs || [];
  metadata.outputs = metadata.outputs || [];
  metadata.exportAs = metadata.exportAs || '';

  metadata.outputs.forEach((method: string) => {
    (Mock as any).prototype[method] = new EventEmitter<unknown>();
  });

  return Component(metadata)(Mock as any);
}
