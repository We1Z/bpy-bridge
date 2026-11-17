export type BookSection = {
  id: string
  title: string
  page: number
  summary: string
  image: string
  lessonId?: string
}

export type BookChapter = {
  id: string
  number: string
  title: string
  range: string
  description: string
  sections: BookSection[]
}

const image = (id: string) => `book-pages/section-${id.replace('.', '-')}.webp`

export const bookChapters: BookChapter[] = [
  {
    id: 'chapter-1', number: '01', title: 'Getting Started', range: 'Pages 15–59',
    description: 'Set up Blender’s scripting environment, run your first code, and build the foundational Operator and Panel patterns used throughout the book.',
    sections: [
      { id: '1.1', title: 'Setting up Blender', page: 17, image: image('1.1'), lessonId: 'first-script', summary: 'Choose an appropriate Blender release and enable Developer Extras and Python Tooltips. These options expose source navigation and Python paths that make API discovery much easier.' },
      { id: '1.2', title: 'Blender Scripting Workspace', page: 18, image: image('1.2'), lessonId: 'first-script', summary: 'Tour the Text Editor, Python Console, Info editor, and System Console. Learn which surface runs code, which one displays operator reports, and where print output actually appears.' },
      { id: '1.3', title: 'Running Python Code in Blender', page: 20, image: image('1.3'), lessonId: 'first-script', summary: 'Compare the Python Console, Text Editor, and registered add-on workflows. The section also covers console shortcuts, Textblock storage, logging, and safer alternatives to automatic script registration.' },
      { id: '1.4', title: 'Scripting First Steps', page: 27, image: image('1.4'), lessonId: 'first-script', summary: 'Begin with small scene experiments in a fresh Blender file. This is the transition from configuring the environment to inspecting data and making observable scene changes.' },
      { id: '1.5', title: 'The Blender Python Modules', page: 27, image: image('1.5'), lessonId: 'mental-model', summary: 'Meet the three main entry points: bpy.data for file data, bpy.context for current UI and selection state, and bpy.ops for registered commands. The examples also introduce active versus selected Objects and Object.data.' },
      { id: '1.6', title: 'Interacting', page: 30, image: image('1.6'), lessonId: 'context-data', summary: 'Iterate selected Objects and inspect their names, Object types, and attached data. The section highlights why Object.type describes a broad category rather than every subtype of the attached data.' },
      { id: '1.7', title: 'Editing', page: 31, image: image('1.7'), lessonId: 'context-data', summary: 'Use direct RNA edits to rename, move, hide, and organize Objects. These first edits demonstrate how Python can reproduce common manual viewport and Outliner actions.' },
      { id: '1.8', title: 'Calling Operators', page: 34, image: image('1.8'), lessonId: 'operators', summary: 'Call existing commands through categorized bpy.ops paths. Operators encapsulate context checks, scene edits, and undo behavior, making them useful building blocks for larger tools.' },
      { id: '1.9', title: 'Custom Operators', page: 36, image: image('1.9'), lessonId: 'operators', summary: 'Dissect a minimal bpy.types.Operator: bl_idname, labels, options, poll, and execute. Registration turns the Python class into a command discoverable by Blender’s UI and other scripts.' },
      { id: '1.10', title: 'Our First Operator', page: 40, image: image('1.10'), lessonId: 'operators', summary: 'Build a practical origin-to-bottom tool from an artist problem. The walkthrough adds configurable offset behavior, mesh bounds, transform reasoning, and an alternative ray-cast approach.' },
      { id: '1.11', title: 'Custom Panels', page: 45, image: image('1.11'), lessonId: 'panels', summary: 'Create a Panel class and place it in Blender’s interface with space, region, and category metadata. Its draw method becomes the home for the custom Operator.' },
      { id: '1.12', title: 'Components', page: 48, image: image('1.12'), lessonId: 'panels', summary: 'Add labels, Operator buttons, property inputs, rows, columns, boxes, and separators. Layout objects returned by these methods let you structure a readable artist-facing tool.' },
      { id: '1.13', title: 'Custom Properties', page: 54, image: image('1.13'), lessonId: 'properties', summary: 'Create a PropertyGroup and attach it to the Scene for editable settings and UI state. The Panel can then draw those typed values and pass them into tool behavior.' },
      { id: '1.14', title: 'Where to Get Help', page: 58, image: image('1.14'), summary: 'Use the official API reference, Blender Artists, and Blender Stack Exchange effectively. The section recommends a minimal reproducible example and complete error details when asking for help.' },
    ],
  },
  {
    id: 'chapter-2', number: '02', title: 'API Fundamentals', range: 'Pages 60–106',
    description: 'Understand the systems beneath the snippets: bpy_struct, DNA and RNA, datablock collections, context, Operator introspection, properties, and callbacks.',
    sections: [
      { id: '2.1', title: 'The BPY Module', page: 61, image: image('2.1'), lessonId: 'mental-model', summary: 'Survey the core namespaces including bpy.data, bpy.context, bpy.ops, bpy.types, bpy.props, and mathutils. Their separation explains where to look for data, commands, base classes, properties, and math.' },
      { id: '2.2', title: 'Blender’s Data Model', page: 62, image: image('2.2'), lessonId: 'mental-model', summary: 'Trace Blender types back to bpy_struct and the underlying data model. This shared structure gives Objects, UI elements, and other RNA-backed values a consistent property interface.' },
      { id: '2.3', title: 'DNA and RNA', page: 64, image: image('2.3'), lessonId: 'properties', summary: 'DNA describes Blender’s internal stored structures; RNA wraps them for runtime access. RNA paths such as an Object’s location array provide stable routes into that data from Python and the UI.' },
      { id: '2.4', title: 'bpy.data', page: 65, image: image('2.4'), lessonId: 'mental-model', summary: 'Work directly with datablock collections: lookup by name, safe get access, iteration, creation, removal, and linked-library identity. The section emphasizes that creating data does not always link it into a scene.' },
      { id: '2.5', title: 'Context', page: 73, image: image('2.5'), lessonId: 'context-data', summary: 'Read the current Scene, active Object, selection, mode, window, area, region, and space. Context lets the same command follow user intent, but also explains why UI-dependent code can fail in another area or mode.' },
      { id: '2.6', title: 'Operators', page: 79, image: image('2.6'), lessonId: 'operators', summary: 'Call and poll Operators consistently, then inspect their RNA to discover descriptions, arguments, enums, defaults, and ranges. This introspection is a powerful alternative to guessing an Operator signature.' },
      { id: '2.7', title: 'Working with Data', page: 83, image: image('2.7'), lessonId: 'context-data', summary: 'Compare Operator-based creation with direct datablock construction. Learn when convenience and context are useful, and when explicit control over Objects, meshes, and collections is the better tool.' },
      { id: '2.8', title: 'Editing', page: 85, image: image('2.8'), lessonId: 'context-data', summary: 'Edit names, visibility, Object data, hierarchy, and collection links. The section covers naming collisions, link and unlink operations, recursive child collections, and the way Blender groups script edits into undo steps.' },
      { id: '2.9', title: 'Defining Properties', page: 91, image: image('2.9'), lessonId: 'properties', summary: 'Declare typed properties with bpy.props annotations on registered classes. Names, descriptions, defaults, limits, and subtypes define both the data contract and the UI Blender generates.' },
      { id: '2.10', title: 'Contextual UI State', page: 93, image: image('2.10'), lessonId: 'panels', summary: 'Inspect window dimensions, workspace, area, region, and space data to understand where code is running. These values support context-sensitive UI behavior and more reliable Operator polling.' },
      { id: '2.11', title: 'Callbacks', page: 95, image: image('2.11'), summary: 'React to application events with bpy.app.handlers and to RNA property changes with bpy.msgbus. Examples include frame changes, file operations, renders, undo, and datablock updates.' },
      { id: '2.12', title: 'Best Practices', page: 101, image: image('2.12'), lessonId: 'addon-package', summary: 'Harden scripts with deliberate error handling, predictable state, cleanup, and careful registration. The guidance focuses on stability in a host application where tools share the same runtime and UI.' },
    ],
  },
  {
    id: 'chapter-3', number: '03', title: 'Development in Practice', range: 'Pages 107–147',
    description: 'Move from Text Editor experiments to a professional external development environment and distributable add-ons or extensions with managed dependencies.',
    sections: [
      { id: '3.1', title: 'Installing Python', page: 108, image: image('3.1'), lessonId: 'addon-package', summary: 'Install a separate Python interpreter for development tools and IDE support. Matching Blender’s major and minor Python version improves completion and typing accuracy even though execution still happens inside Blender.' },
      { id: '3.2', title: 'Setting up your External IDE', page: 109, image: image('3.2'), lessonId: 'addon-package', summary: 'Configure VS Code or PyCharm with useful Python extensions, formatting, linting, and Blender-aware development support. The specific editor is less important than a consistent, navigable workflow.' },
      { id: '3.3', title: 'Setting up Your Blender Project', page: 112, image: image('3.3'), lessonId: 'addon-package', summary: 'Organize source, resources, tests, and supporting files in a dedicated project. A deliberate folder structure prepares one-file experiments to become maintainable multi-module tools.' },
      { id: '3.4', title: 'Virtual Environments', page: 115, image: image('3.4'), lessonId: 'addon-package', summary: 'Isolate development dependencies and install Blender Python stubs for completion and type hints. Here the environment primarily supports the IDE rather than replacing Blender’s embedded runtime.' },
      { id: '3.5', title: 'Creating Add-ons', page: 117, image: image('3.5'), lessonId: 'addon-package', summary: 'Package Operators, Panels, properties, and preferences into a traditional add-on. The section walks through metadata, module layout, registration, installation, and user preferences.' },
      { id: '3.6', title: 'Creating Extensions', page: 125, image: image('3.6'), lessonId: 'addon-package', summary: 'Use the extension format introduced in Blender 4.2 for repository-based discovery and distribution. A manifest replaces bl_info and provides structured metadata, permissions, platforms, and dependency declarations.' },
      { id: '3.7', title: 'Adding Wheels', page: 134, image: image('3.7'), lessonId: 'addon-package', summary: 'Bundle third-party Python packages as wheels inside an extension. The example downloads a pure-Python dependency, declares it in the manifest, and imports it from Blender after installation.' },
      { id: '3.8', title: 'Wheels for Multiple Platforms', page: 140, image: image('3.8'), lessonId: 'addon-package', summary: 'Support compiled dependencies by downloading wheels for each operating system and CPU architecture. Blender platform names must be mapped to PyPI tags and every required wheel listed explicitly.' },
      { id: '3.9', title: 'Building with BEB', page: 142, image: image('3.9'), lessonId: 'addon-package', summary: 'Streamline extension creation and packaging with the Blender Extension Builder. The section positions BEB as a way to reduce repetitive manifest, wheel, and build work.' },
    ],
  },
  {
    id: 'chapter-4', number: '04', title: 'Building Our Own Tools', range: 'Pages 148–237',
    description: 'Go deeper into property variations, Operator lifecycle and interaction, debugging, undo, macros, and optional Qt-based desktop interfaces connected to Blender.',
    sections: [
      { id: '4.1', title: 'Property Types', page: 149, image: image('4.1'), lessonId: 'properties', summary: 'A reference tour of Blender’s property types, groups, and subtypes. Treat this as lookup material: copy a declaration into an Operator or PropertyGroup when a particular input is needed.' },
      { id: '4.2', title: 'Numeric Types', page: 150, image: image('4.2'), lessonId: 'properties', summary: 'Configure Bool, Int, Float, and vector variants with defaults, limits, soft ranges, and display subtypes. The section also develops the broader property gallery through strings, enums, pointers, and collections.' },
      { id: '4.3', title: 'Operator Info', page: 169, image: image('4.3'), lessonId: 'operators', summary: 'Classify Operators as executable, invokable, modal, or macro. This model clarifies whether a command runs immediately, asks for input, continues over many events, or chains other commands.' },
      { id: '4.4', title: 'Metadata', page: 172, image: image('4.4'), lessonId: 'operators', summary: 'Choose stable bl_idname values and user-facing labels, descriptions, and options. Namespacing prevents conflicts, while REGISTER and UNDO determine how the command appears and participates in editing history.' },
      { id: '4.5', title: 'Undo', page: 174, image: image('4.5'), lessonId: 'operators', summary: 'Understand undo chunks, grouping, and the limits of Python control. UNDO, UNDO_GROUPED, and the internal undo_push escape hatch are compared, with a caution against unnecessary forced history steps.' },
      { id: '4.6', title: 'Debugging', page: 175, image: image('4.6'), lessonId: 'operators', summary: 'Combine terminal tracebacks and logging with Operator reports for artists. INFO, WARNING, and ERROR messages surface differently in Blender, so choose both message severity and delivery channel deliberately.' },
      { id: '4.7', title: 'Invocation', page: 177, image: image('4.7'), lessonId: 'operators', summary: 'Follow poll, invoke, draw, and execute as one command lifecycle. Learn when to reject context, request properties, render a dialog, execute immediately, or pass values from Python.' },
      { id: '4.8', title: 'Modal Operators', page: 182, image: image('4.8'), lessonId: 'capstone', summary: 'Keep an Operator active across mouse and keyboard events with modal handlers and RUNNING_MODAL. A practical f-curve noise example demonstrates previews, event handling, confirmation, cancellation, and redraw.' },
      { id: '4.9', title: 'Macros', page: 192, image: image('4.9'), lessonId: 'operators', summary: 'Chain multiple Operators into one reusable command with bpy.types.Macro. Macros are useful when existing commands already provide the required steps and their contexts can be kept compatible.' },
      { id: '4.10', title: 'Extending with Qt', page: 195, image: image('4.10'), summary: 'Introduce Qt, PySide, and PySide6 for interfaces beyond Blender’s native UILayout. The section establishes the Qt event-loop integration needed for windows to remain responsive alongside Blender.' },
      { id: '4.11', title: 'Building with Widgets', page: 207, image: image('4.11'), summary: 'Build persistent desktop interfaces with QtWidgets, inheritance, signals, slots, layouts, and data models. Unlike Blender’s redrawn layouts, Qt constructs object-based interfaces once and updates them as needed.' },
      { id: '4.12', title: 'Building with QML', page: 221, image: image('4.12'), summary: 'Use QtQuick and QML for declarative layouts, anchors, property bindings, and animation. JavaScript expressions replace much of the manual value synchronization used in widget-based interfaces.' },
      { id: '4.13', title: 'Connecting Qt to Blender', page: 227, image: image('4.13'), lessonId: 'nbb-architecture', summary: 'Call Blender Operators from Qt and synchronize sliders in both directions. These examples turn a standalone Qt window into a real Blender tool while introducing the challenges of cross-framework state.' },
    ],
  },
  {
    id: 'chapter-5', number: '05', title: 'Drawables and Gizmos', range: 'Pages 238–325',
    description: 'Apply vectors, matrices, rotations, GPU drawing, event handling, and gizmos to create visual tools that live directly inside Blender’s editors.',
    sections: [
      { id: '5.1', title: 'Math Primer', page: 239, image: image('5.1'), lessonId: 'capstone', summary: 'Prepare for viewport tools with the essential math classes and geometric intuition. The goal is to use vectors and matrices confidently, not to reimplement their internal algorithms.' },
      { id: '5.2', title: 'Vectors', page: 240, image: image('5.2'), lessonId: 'capstone', summary: 'Represent direction and magnitude with mathutils.Vector. Work through construction, arithmetic, length, normalization, dot and cross products, interpolation, and geometric interpretations in 2D and 3D.' },
      { id: '5.3', title: 'Matrices', page: 250, image: image('5.3'), lessonId: 'capstone', summary: 'Use 3×3 and 4×4 matrices to represent rotation and transforms. Identity, multiplication, inversion, translation, and decomposition explain how Blender composes spatial operations.' },
      { id: '5.4', title: 'Rotations', page: 260, image: image('5.4'), lessonId: 'capstone', summary: 'Compare rotation matrices, Euler angles, Quaternions, and axis-angle representations. Conversion methods let you choose a useful representation without losing the underlying transform.' },
      { id: '5.5', title: 'Visual Feedback', page: 265, image: image('5.5'), summary: 'Move beyond Panels into overlays, editor drawing, and custom controls. The section explains Blender’s gpu-based drawing model and the lifecycle required to register, draw, and clean up visual feedback.' },
      { id: '5.6', title: 'Drawing in 2D', page: 269, image: image('5.6'), summary: 'Follow the complete gpu drawing pipeline: callback, geometry, shader, batch, draw state, draw call, and cleanup. Simple shapes introduce region types, coordinates, transparency, and primitive modes.' },
      { id: '5.7', title: 'Making It Interactive', page: 281, image: image('5.7'), summary: 'Wrap drawable state in a reusable class and respond to mouse position, hover, drag, and viewport scale. NumPy supports efficient geometry updates, and the final example connects a 2D draggable control to Blender data.' },
      { id: '5.8', title: 'Gizmos', page: 295, image: image('5.8'), summary: 'Create persistent, context-sensitive viewport controls with Blender’s gizmo system. Starting from node-based examples and moving into Python gizmos, the section contrasts always-available controls with modal interaction.' },
    ],
  },
  {
    id: 'glossary', number: 'A–Z', title: 'Glossary', range: 'Pages 326–342',
    description: 'A compact reference for the API, UI, mathematics, and Qt terminology used throughout the book.',
    sections: [
      { id: 'glossary', title: 'Blender Development Glossary', page: 326, image: image('glossary'), summary: 'Look up terms including Active, Add-on Preferences, affine matrix, context, datablock, DNA, RNA, modal Operator, PropertyGroup, Quaternion, gizmo, and Qt signals and slots.' },
    ],
  },
]

export const bookSections = bookChapters.flatMap((chapter) => chapter.sections)
