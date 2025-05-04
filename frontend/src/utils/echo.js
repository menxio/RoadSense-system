import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "d73ac3ec682b36cc7d97",
  cluster: "ap1",
  forceTLS: true,
});

export default echo;
