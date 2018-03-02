# Swishbox
[![Build Status](https://travis-ci.org/encadyma/swishbox.svg?branch=master)](https://travis-ci.org/encadyma/swishbox) [![Build status](https://ci.appveyor.com/api/projects/status/1t3re4ape204l6l1/branch/master)](https://ci.appveyor.com/project/encadyma/swishbox/branch/master)


Swishbox is a Youtube music player made for people who rely on Youtube's vast video library for their music needs. It keeps the listening experience simple: search to find music, click to queue song. Enjoy doing what you love, distraction-free.

---

_NOTE: This project is in EARLY DEVELOPMENT. Expect incomplete/unintentional behavior as a part of testing Swishbox. We encourage our early testers to share **feature requests** or any **trouble** they had with the app on the [project issues page](https://github.com/encadyma/swishbox/issues). Thank you for taking part in Swishbox's first development stages._

---

## Usage

Swishbox in **four easy steps**:

1. Open the search box and type in a song title, artist, genre, etc.
2. Click on any song in the results to add it to your playlist.
3. Wait for the song to download. It will start playing once it is finished. (optional: add more songs while it is loading)
4. Be happy!

The goal is to be as simple as it can be so it doesn't get in your way.

## Install Instructions

#### Step 1
All of Swishbox's releases can be found [here](https://github.com/encadyma/swishbox/releases). As of now, it is recommended that all testers download the **latest nightly release**.

[Download Swishbox here.](https://github.com/encadyma/swishbox/releases)

#### Step 2

- **For Windows users:** Download `swishbox-setup-[version].exe` and double-click to execute the setup program.
- **For Mac users:** Download and double-click `swishbox-[version].dmg`. Drag `Swishbox Nightly.app` to your Applications folder and double-click to open. Alternatively, download and unzip `swishbox-[version]-mac.zip` for the app directly.
- **For Linux users:** Download and open the AppImage `swishbox-[version]-x86_64.AppImage`.

## Building From Source
Swishbox prefers the `yarn` tool over `npm`. Follow the instructions on [Yarn's installation page](https://yarnpkg.com/lang/en/docs/install/) to learn how to install `yarn` for your operating system.

``` bash
# clone repository and change dir
git clone https://github.com/encadyma/swishbox.git && cd swishbox

# install dependencies
yarn

# launch the electron app
yarn run dev

```
## Development Resources
- Repo (you are here): [https://github.com/encadyma/swishbox](https://github.com/encadyma/swishbox)
- Trello: [https://trello.com/b/fbyE33I3/swishbox](https://trello.com/b/fbyE33I3/swishbox)
- Issue Tracker: [https://github.com/encadyma/swishbox/issues](https://github.com/encadyma/swishbox/issues)

## Credits
- Kevin Mo [@encadyma](https://github.com/encadyma) (core, project owner + maintainer)

## Licensing

This program is licensed under the **GNU General Public License v3.0**. Read [LICENSE](https://github.com/encadyma/swishbox/blob/master/LICENSE) for more information about this license.

---

Copyright (c) 2017 Kevin Mo.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.