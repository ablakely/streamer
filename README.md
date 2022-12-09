# streamer

This is a node.js daemon that captures a still from a URL and streams it to the client as a .mjpeg over HTTP.  This is useful for IP cameras/NVRs
that do not offer a MJPEG or other stream but do allow you to see a still image from camera.

## Config 

streamer reads a JSON file as it's config from `./streams.json`

    {
        "/stream1.mjpeg": "https://127..../still-image.jpg"
    }

### Optional Settings

* `_pol_interval_` (Number) can be used to set how often the server fetches a frame from the still image URL in miliseconds.

* `_listen_port_` (Number) can be used to change the port the HTTP server listens on, the default is 8000.

---
_Written by Aaron Blakely \<aaron@ephasic.org\>_