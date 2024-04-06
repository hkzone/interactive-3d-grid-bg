# Interactive 3D Grid with Custom Shaders

This project presents an artful representation of an interactive 3D grid composed of instanced boxes, each acting as a pixel alike in a larger image. Utilizing Three.js and GLSL shaders, it stretches a single texture across the tops of the instanced boxes to form a cohesive background. The visual appeal is further enhanced by wave-like animations that gracefully traverse the grid, coupled with responsive animations that react to mouse movements, creating an engaging and dynamic user experience.

## Deployed Version

For live demo please visit 👉 https://interactive-3d-grid-bg.vercel.app/

## Key Features

- **Instanced Geometry:** Utilizes Three.js InstancedMesh to create a grid of boxes that collectively act as the canvas for the background texture.
- **Texture Mapping:** Custom shaders carefully map segments of a single large texture across the top faces of the boxes, making the grid appear as a continuous surface from a distance.

- **Dynamic Animations:** Embellished with a calming wave animation that passes over the grid, creating a mesmerizing visual effect reminiscent of a gentle sea.

- **Mouse Interaction:** The grid responds to mouse movement, where the proximity to each box influences the amplitude of the animation, giving life to the scene as the user interacts with it.

- **Performance Optimized:** Instanced rendering delivers a high-performance experience, enabling complex visuals with minimal draw calls.

- **Customizable Parameters:** Integrated `lil-gui` controls allow for real-time modification of key animation properties.

## Setup Instructions

Please follow these setup instructions to get the project running locally:

### Prerequisites

- Node.js installed on your system.

### Installation

Clone the repository and install dependencies:

````bash
git clone https://github.com/hkzone/interactive-3d-grid-background.git
cd interactive-3d-grid-bg
npm install


3. **Run the development server:**

   ```bash
   npm run dev
````

4. **Build for production:**

   ```bash
   npm run build
   ```

   The production-ready files will be in the `dist/` folder.

## Shaders

The project uses custom GLSL shaders for two distinct visual effects:

1. **Top Face Texture Mapping:** Handles application of unique parts of a texture to each box's top face.

2. **Edge Visibility:** Dynamically displays the texture's edge pixels on the sides of the boxes.

## Uniforms Control

`lil-gui` is used to create a GUI for live interaction with shader uniforms. Press 'h' to toggle the controls visibility in the UI.

## Project Structure

- `src/script.js`: Main JavaScript entry point for setting up Three.js scene, loading shaders, and logic for interaction.
- `src/style.css`: Styles for the canvas and any HTML UI.
- `src/rendering.js`: Sets up the Three.js rendering.
- `src/utils.js`: Provides utility functions, e.g., for mouse position calculation.
- `src/shaders/`: Directory containing GLSL shader files (`.glsl`).
- `public/bg.webp`: Example background texture for the scene's grid.

## Interaction

By moving the mouse across the canvas, users distort the grid, illustrating real-time interaction with instanced geometries.

## Debugging and Configuration

A series of commented lines are available to activate helpers and controls for debugging and fine-tuning the scene (camera position, light helpers, etc.).

## Contributing

If you'd like to contribute, please fork the repository, create a feature branch, and submit a pull request with your changes.

## License

This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License. For more information, see `LICENSE` or visit [Creative Commons License](https://creativecommons.org/licenses/by-nc/4.0/)

## Social

Made By [Vitaliy Vlasyuk @_hkzone_](https://twitter.com/_hkzone_)

[Twitter](https://twitter.com/_hkzone_) - [Portfolio](https://vitaliyvlasyuk.com/) - [Github](https://github.com/hkzone)
