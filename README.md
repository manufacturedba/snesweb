# tepacheweb

Browser application for watching and interacting with Tepache Mode

Player provided by [OvenPlayer](https://www.ovenmediaengine.com/ovenplayer)

## Running an Ember Application

### Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

### Installation

- `git clone https://github.com/manufacturedba/tepacheweb` this repository
- `cd tepacheweb`
- `npm install`

### Running / Development

- `ember serve`
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Running / Production

- `npm start`

_Be sure to build application prior to running production server_

#### Environment parameters

`GOOGLE_MEASUREMENT_ID` - Unique tag ID for Google Analytics usage V4

#### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

#### Running Tests

- `ember test`
- `ember test --server`

#### Linting

- `npm run lint`
- `npm run lint:fix`

#### Building

- `ember build` (development)
- `GOOGLE_MEASUREMENT_ID=G-XXXXXXXXXX ember build --environment production` (production)

### Further Reading / Useful Links

- [ember.js](https://emberjs.com/)
- [ember-cli](https://cli.emberjs.com/release/)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
