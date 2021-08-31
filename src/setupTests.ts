// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// class Worker {
//     constructor(stringUrl: string) {
//         this.url = stringUrl;
//         this.onmessage = () => {};
//     }

//     postMessage(msg: any) {
//         this.onmessage(msg);
//     }

//     onmessage(this: Worker, ev: MessageEvent) {
//         console.log('onmessage called');
//     };

//     onmessageerror(this: Worker, ev: MessageEvent) {
//         console.log('onmessageerror called');
//     };
    
//     terminate() {
//         console.log('terminate called');
//     };

//     addEventListener(type, listener, options) {
//         console.log('addEventListener called');
//     };

//     removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
//         console.log('removeEventListener called');
//     };

//     dispatchEvent(event: Event) {
//         console.log('dispatchEvent called');
//         return true;
//     };

//     onerror(this: AbstractWorker, ev: ErrorEvent) {
//         console.log('onerror called');
//     };
// }

// @ts-ignore
// window.Worker = Worker