import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import 'bootstrap/dist/css/bootstrap.css'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
