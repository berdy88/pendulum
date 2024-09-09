# pendulum

A simple pendulum simulator. The frontend and backend subfolders must be run concurrently for it to function properly.

## Installation

```shell
# Clone the repo
git clone https://github.com/berdy88/pendulum.git

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install

```

## Usage

```shell
# Start both backend and frontend
npm run start

# Access UI at local URL shown in terminal
```

# Pendulum API Documentation

## `POST /configure`

Sets the initial parameters of the pendulum.

##### Parameters
| name          | type   | description                                               |
|---------------|--------|-----------------------------------------------------------|
| mass          | number | the mass of the bob of the pendulum                       |
| angularOffset | number | the starting angle of the pendulum                        |
| stringLength  | number | the lenght of the string of the pendulum                  |
| stringOffset | number | corresponds to the x coordinate of the string attach point |

##### Response

`200 OK`

## `GET /start`

Starts the pendulum simulation. This will reset the pendulum's state to the last parameters
configured with the `/configure` endpoint before starting the simulation. 

##### Parameters
_None_

##### Response

`200 OK`

## `GET /stop`

Stops the pendulum simulation.

##### Parameters
_None_

##### Response

`200 OK`

## `GET /resume`

Resumes the pendulum simulation, continuing where it was stopped.

##### Parameters
_None_

##### Response

`200 OK`

## `GET /coordinates`

Returns the current coordinates of the pendulum.

##### Parameters
_None_

##### Response

`200 OK`

| name | type   | description  |
|------|--------|--------------|
| x    | number | x coordinate |
| y    | number | y coordinate |
