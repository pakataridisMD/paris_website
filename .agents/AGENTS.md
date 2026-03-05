# Workspace Rules

## Browser Tool

- Do NOT use the browser subagent tool unless the user explicitly asks for it.

## Animations

- Always use `motion` from `motion/react` (framer-motion) for all animations and transitions.
- Do NOT use raw CSS animations or `@keyframes` unless they are for simple looping effects inside SVGs or pseudo-elements that motion cannot handle.

## Images

- Always use `next/image` (`Image` from `next/image`) instead of raw `<img>` tags.
- Set `width`, `height`, or `fill` props as appropriate for layout.
- Use `priority` for above-the-fold hero images.
