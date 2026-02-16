# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





=================Project Documentation Folder Structure Desrciption =================
>.widsurf
-folder for windsurf  Ai reference with UI/UX Pro max (AI Based design helper)

>backend
-Folder for the backend
     >config
     -folder for the configuration files
     >controllers
     -folder containing the controllers of the backend connecting the routes and the model
     >models
     -folder containing the models of the backend connecting the controller to the database
     >routes
     - folder containing the routes of the backend connecting the controller to the frontend

>frontend
-folder for the frontend
     >src
     -folder containing the source code of the frontend
        >components
        containing the components of the frontend like :
        -Buttons,Cards,Dashboard_Components,DataTables, Forms, Input_Fields, Layouts,Loading_UI, Logo , Modal

     >pages
     -contains the pages of the frontend .