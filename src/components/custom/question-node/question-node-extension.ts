import { Node, mergeAttributes } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';

export interface QuestionNodeOptions {
    HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        questionNode: {
            insertQuestion: (attrs: Partial<QuestionNodeAttrs>) => ReturnType;
            setQuestionAnswer: (id: string, answer: string) => ReturnType;
        };
    }
}

export interface QuestionNodeAttrs {
    id: string;
    label: string;
    type: 'short' | 'long' | 'multipleChoice' | 'checkbox';
    placeholder?: string;
    answer?: string;
    options?: string[];
    required?: boolean;
    defaultAnswer?: string;
}

export const QuestionNode = Node.create<QuestionNodeOptions>({
    name: 'questionNode',
    group: 'block',
    selectable: true,
    atom: false,

    addOptions() {
        return {
            HTMLAttributes: {},
            draggable: true, // <-- THIS IS REQUIRED
        };
    },

    addAttributes() {
        return {
            id: {
                default: () => uuidv4(),
                parseHTML: el => el.getAttribute('data-id') || uuidv4(),
                renderHTML: attrs => ({ 'data-id': attrs.id }),
            },
            label: {
                default: 'Untitled question',
                parseHTML: el => el.getAttribute('data-label') || 'Untitled question',
                renderHTML: attrs => ({ 'data-label': attrs.label }),
            },
            type: {
                default: 'short',
                parseHTML: el => el.getAttribute('data-type') || 'short',
                renderHTML: attrs => ({ 'data-type': attrs.type }),
            },
            placeholder: {
                default: '',
                parseHTML: el => el.getAttribute('data-placeholder') || '',
                renderHTML: attrs => ({ 'data-placeholder': attrs.placeholder }),
            },
            answer: {
                default: '',
                parseHTML: el => el.getAttribute('data-answer') || '',
                renderHTML: attrs => ({ 'data-answer': attrs.answer }),
            },
            options: {
                default: undefined,
                parseHTML: el => {
                    const data = el.getAttribute('data-options');
                    return data ? JSON.parse(data) : undefined;
                },
                renderHTML: attrs => (
                    attrs.options ? { 'data-options': JSON.stringify(attrs.options) } : {}
                ),
            },
            required: {
                default: false,
                parseHTML: element => element.getAttribute("data-required") === "true",
                renderHTML: attributes => ({
                    "data-required": attributes.required ? "true" : "false",
                }),
            },
            defaultAnswer: {
                default: "",
                parseHTML: element => element.getAttribute("data-default-answer") || "",
                renderHTML: attributes => ({
                    "data-default-answer": attributes.defaultAnswer || "",
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="question-node"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-type': 'question-node',
                style: 'padding: 8px; border: 1px solid #eee; border-radius: 6px; margin: 8px 0;',
            }),
            HTMLAttributes.label || 'Untitled question',
        ];
    },

    addCommands() {
        return {
            insertQuestion:
                (attrs = {}) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: {
                                id: attrs.id || uuidv4(),
                                label: attrs.label || 'Untitled question',
                                type: attrs.type || 'short',
                                placeholder: attrs.placeholder || '',
                                answer: attrs.answer || '',
                            },
                        });
                    },
            setQuestionAnswer:
                (id, answer) =>
                    ({ tr, state, dispatch }) => {
                        let found = false;
                        state.doc.descendants((node, pos) => {
                            if (node.type.name === this.name && node.attrs.id === id) {
                                found = true;
                                if (dispatch) {
                                    dispatch(
                                        tr.setNodeMarkup(pos, undefined, {
                                            ...node.attrs,
                                            answer,
                                        })
                                    );
                                }
                                return false;
                            }
                            return true;
                        });
                        return found;
                    },
        };
    },
});
