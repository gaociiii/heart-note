import worker from '../dist/server/index.js';

export default function onRequest(context) {
  return worker.fetch(context.request, context.env);
}
