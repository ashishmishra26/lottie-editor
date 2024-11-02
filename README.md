# Lottie Editor

Real-Time Lottie Animation Editor with Collaboration

## Overview

The Lottie Editor is a powerful web-based tool for creating, editing, and previewing Lottie animations. Designed with collaboration in mind, this editor allows multiple users to work on animations in real time, making it perfect for teams and designers looking to bring their animations to life seamlessly.

## Features

- **Real-Time Editing**: Update and preview Lottie animations instantly as changes are made.
- **Collaboration**: Invite team members to work on animations with you in real time, with synchronized updates.
- **User-Friendly Interface**: Intuitive design for both beginners and advanced users to edit Lottie animations.
- **Layered Editing**: Edit layers, colors, and properties for in-depth customization of animations..

## Installation

To run the Lottie Editor locally, follow these steps:

1. **Clone the Repository**
   ```bash
    git clone https://github.com/ashishmishra26/lottie-editor.git
    cd lottie-editor
   ```

2. **Install Dependencies**
    ```bash
    npm install
   ```

3. **Start the Development Server**
    ```bash
    cd client
    npm run dev
   ```

4. **Open the Application**

    Navigate to http://localhost:5173 to use the editor in your browser.

Note: Check `server/README.md` for instructions to run server locally.


## Built With

* React: For building the user interface.
* Lottie: Handles rendering of Lottie animations.
* React Query: To maintain the data fetching.
* Zustand: To manage state.

* Floating UI: Used for floating menus and tooltips.
* Prisma -  To store playground and json data.
* GraphQL - To fetch featured animation
* Fastify - To write APIs and to manage websockets on server.

## Available Scripts
 * npm run dev: Runs the development server.
 * npm run build: Builds the app for production.

## Contributing

1. Fork the repository.

2. Create a new branch with your feature or bug fix:
    ```bash
        git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
        git commit -m "Add feature description"
    ```
4. Push to the branch:
    ```bash
        git push origin feature-name
    ```

5. Open a Pull Request for review.
