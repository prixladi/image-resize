# Image resize

Web api for resizing images using [Sharp](https://github.com/lovell/sharp) library. Supports resizing images from provided url or from the static folder. Using [NestJS](https://nestjs.com/) web framework and [Redis](https://redis.io/) for optional caching.

## Routes

For endpoint documentation there is swagger available on **/swagger/** route after starting the app.

## Env variables

| Name  | Data type | Description  | Deafult |
|---|---|---|---|
| USE_REDIS_CACHE | boolean | Flag whether to use Redis caching for resized images or not | false |
| CACHE_DURATION_IN_MINUTES | number |  Duration of redis cached | 120 | 
|  REDIS_HOST | string |  Redis host | localhost | 
|  REDIS_PORT | number| Redis port | 6379 |

## Running application

In development mode, you can start the application using `yarn dev` command. If you want to use Redis caching in development mode you need to have Redis running, you can use the docker version and start it using `docker-compose up redis` command in the root folder.

For production release you can use for example docker container, you can find an example in `docker-compose.yml` file where you can find the service itself with static folder mapped to `.resize/static` folder, Redis container without mapped volume, and even nginx with configuration in `config/nginx` folder.

## Isn't NestJS overkill for such a small app?

Yes, it is right now. But this is just a prototype and there are more planned features for the future.

