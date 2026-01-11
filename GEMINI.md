# Gemini Usage

This document outlines how to use Gemini for development in this project.

## Library-Specific Context

To provide Gemini with specific context for each library, you can create a `gemini` directory inside the library's root folder. Inside the `gemini` directory, you can create the following files:

- `description.md`: A description of the library, its purpose, and any other relevant information.
- `todos.md`: A list of tasks or TODOs for the library.

When you want Gemini to read these files, you can say: "I'm working on the `<library-name>` library now. Please read the context files."

## Plan then confirm 

Before changing any code create plan and confirm it with the user.
