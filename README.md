# Three.js Journey WebXR

This project is an adaptation of selected lessons from Bruno Simon's [Three.js Journey](https://threejs-journey.com/) course, modified to support VR and AR using WebXR. The goal is to make these lessons immersive and accessible across multiple platforms, including:

- **Desktop** (standard Three.js experience)
- **Meta Quest 3** (Mixed-Reality AR & Immersive-VR, unverified on other headsets)
- **Android Mobile-AR** (via WebXR AR mode)
- **iOS Mobile-AR** (via [EyeJack App Clips](https://eyejack.io/))

## Live Demos
Each lesson adaptation is available as a live demo:

| Lesson | Description | Live Demo |
|--------|-------------|------------|
| 32-coffee-smoke | Animated smoke effect in a coffee cup | [Demo](https://threejs-journey-coffee-webxr.vercel.app/) |
| 38-earth-shaders | Realistic Earth shaders | [Demo](https://threejs-journey-earth-webxr.vercel.app/) |
| 40-particles-morphing-shader | Morphing particles effect | [Demo](https://threejs-journey-morph-webxr.vercel.app/) |
| 41-gpgpu-flow-field-particles-shaders | GPGPU flow field particles | [Demo](https://threejs-journey-gpgpu-webxr.vercel.app/) |
| 61-portal-scene-with-r3f | Portal scene using R3F | [Demo](https://threejs-journey-portal-webxr.vercel.app/) |

## Development Notes
The majority of these lessons were originally built in **vanilla Three.js** and had to be converted to **React Three Fiber (R3F)** to better integrate with modern WebXR workflows. This conversion process was a challenge in itself. The exception is **61-portal-scene-with-r3f**, which was already implemented in R3F by Bruno Simon.

A key goal of this project was to tackle some of Bruno's more **challenging shader-based lessons**, as they are visually stunning. Experiencing these effects in **Mixed-Reality (AR) and Immersive-VR** takes them to an entirely new level, enhancing their sense of depth and interaction.

## Installation & Development
Each sub-project is independent, containing its own `package.json`, `vite.config.js`, and dependencies. To run a specific lesson:

1. Clone the repository:
   ```sh
   git clone https://github.com/shpowley/threejs-journey-webxr.git
   cd threejs-journey-webxr
   ```
2. Navigate to the desired sub-project:
   ```sh
   cd 40-particles-morphing-shader  # Example: Replace with the desired lesson
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000` (or the port specified in the console output).

## Licensing
This project is **free and open-source**. It is licensed under the [MIT License](LICENSE), meaning you are free to use, modify, and distribute it, provided you include the original license.

## Credits
- **Bruno Simon** - [Three.js Journey](https://threejs-journey.com/) (original lessons)
- **React Three Fiber & WebXR** - [react-three/xr](https://github.com/pmndrs/react-three-xr)
- **Hosting** - [Vercel](https://vercel.com/)

## Additional WebXR Project
Alongside this project, I also developed a WebXR port of Bruno Simon's final Three.js Journey lesson:

- **Marble Race Remix** - An experimental WebXR adaptation of Bruno’s marble race lesson, featuring extensive experimentation in mixed-reality and immersive-VR.
  - **GitHub:** [threejs-journey-marble-race-remix](https://github.com/shpowley/threejs-journey-marble-race-remix)
  - **Live Demo:** [Marble Race Remix](https://marble-race-remix.vercel.app/)

## Feedback & Contributions
Contributions and feedback are welcome! Feel free to open an issue or submit a pull request.

- GitHub: [shpowley/threejs-journey-webxr](https://github.com/shpowley/threejs-journey-webxr)

---
Enjoy exploring WebXR with Three.js! 🚀