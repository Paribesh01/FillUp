import { Node, mergeAttributes } from '@tiptap/core';

export const NextPageNode = Node.create({
  name: 'nextPage',
  group: 'block',
  selectable: true,
  atom: true,
  parseHTML() {
    return [
      {
        tag: 'div[data-type="next-page"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'next-page',
        style:
          'display: flex; align-items: center; justify-content: center; margin: 32px 0; width: 100%;',
      }),
      [
        'div',
        {
          style:
            'flex: 1; border-bottom: 3px solid #bbb; margin-right: 16px; height: 0;',
        },
      ],
      [
        'span',
        {
          style:
            'font-size: 1.3rem; font-weight: bold; color: #888; white-space: nowrap; margin: 0 12px;',
        },
        'Next Page',
      ],
      [
        'div',
        {
          style:
            'flex: 1; border-bottom: 3px solid #bbb; margin-left: 16px; height: 0;',
        },
      ],
    ];
  },
});
