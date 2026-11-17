export type Lesson = {
  id: string
  number: string
  module: string
  title: string
  shortTitle: string
  summary: string
  duration: number
  level: 'Foundation' | 'Tool building' | 'Production'
  source: string
  outcomes: string[]
  bridge: {
    title: string
    unreal: string
    blender: string
    caution: string
  }
  concepts: { heading: string; body: string }[]
  steps: { title: string; body: string }[]
  code: {
    filename: string
    unreal: string
    blender: string
  }
  exercise: {
    brief: string
    hint: string
    solution: string
  }
  quiz: {
    question: string
    options: string[]
    answer: number
    explanation: string
  }
}

export const modules = [
  {
    id: 'orient',
    number: '01',
    title: 'Change your mental model',
    description: 'Translate familiar Unreal concepts into Blender’s data, context, and operator model.',
  },
  {
    id: 'build',
    number: '02',
    title: 'Build artist-facing tools',
    description: 'Turn scripts into reliable operators, properties, panels, and installable add-ons.',
  },
  {
    id: 'production',
    number: '03',
    title: 'Think like a pipeline TD',
    description: 'Study the NBB Asset Manager and build a maintainable production tool.',
  },
]

export const lessons: Lesson[] = [
  {
    id: 'mental-model',
    number: '01',
    module: 'orient',
    title: 'Think in data-blocks, not Actors',
    shortTitle: 'The Blender mental model',
    summary: 'The fastest way to learn bpy is to stop looking for a one-to-one Unreal hierarchy. Learn what an Object owns, where scene data lives, and why context matters.',
    duration: 20,
    level: 'Foundation',
    source: 'Book §1.5–1.6, §2.1–2.5',
    outcomes: [
      'Explain the difference between an Object and its data-block.',
      'Find scene content through bpy.data and bpy.context.',
      'Recognize which Unreal analogies help—and which mislead.',
    ],
    bridge: {
      title: 'The central translation',
      unreal: 'An Actor lives in a Level and usually owns Components. You often begin with the Level or an Actor reference.',
      blender: 'An Object is one data-block linked into a Scene. Its mesh, light, or camera is a separate data-block available through object.data.',
      caution: 'Object ≈ Actor is a useful starting analogy, not a rule. Blender collections are not Unreal folders, and object.data is not a Component system.',
    },
    concepts: [
      {
        heading: 'Two doors into the same scene',
        body: 'bpy.data is the file-wide database: objects, meshes, materials, scenes, texts, and more. bpy.context describes what the user is doing right now: the active object, selected objects, current scene, mode, and area. Use data when identity matters; use context when user intent matters.',
      },
      {
        heading: 'An Object is a transform plus a type-specific payload',
        body: 'A mesh Object has location, rotation, scale, modifiers, constraints, and a data pointer to a Mesh. Two Objects can share that Mesh. Editing object.location moves one instance; editing object.data.vertices can affect every Object sharing the mesh.',
      },
      {
        heading: 'Scene membership is a link',
        body: 'Creating bpy.data.objects.new() does not automatically place the Object in your visible scene. Link it to a Collection. That explicit link step is one of the most common differences from spawning an Actor into a Level.',
      },
    ],
    steps: [
      { title: 'Open the Scripting workspace', body: 'Select the default Cube. In Blender’s Python Console, inspect bpy.context.object and then object.data.' },
      { title: 'Compare identity', body: 'Print the Object name, its type, and the Mesh name. Notice that they are separate named data-blocks.' },
      { title: 'Inspect the links', body: 'Print list(object.users_collection). An Object can be linked to more than one collection, unlike a simple folder hierarchy.' },
    ],
    code: {
      filename: 'inspect_scene.py',
      unreal: `import unreal\n\n# Unreal: iterate Actors in the current editor Level\nactors = unreal.EditorLevelLibrary.get_all_level_actors()\n\nfor actor in actors:\n    print(actor.get_name())\n    print(actor.get_actor_location())\n    for component in actor.get_components_by_class(unreal.ActorComponent):\n        print("  component:", component.get_name())`,
      blender: `import bpy\n\n# Blender: Objects linked into the active scene\nfor obj in bpy.context.scene.objects:\n    print(obj.name, obj.type)\n    print("  location:", tuple(obj.location))\n    print("  data:", obj.data.name if obj.data else None)\n    print("  collections:", [c.name for c in obj.users_collection])\n\n# File-wide lookup by exact datablock name\ncube = bpy.data.objects.get("Cube")\nif cube and cube.type == 'MESH':\n    print("Vertex count:", len(cube.data.vertices))`,
    },
    exercise: {
      brief: 'Duplicate the Cube as a linked instance. Keep both Objects independent, but make them share the same Mesh. Print their names and confirm the data names match.',
      hint: 'Use original.copy(), then link the copy with bpy.context.collection.objects.link(copy). Do not call original.data.copy().',
      solution: `original = bpy.context.object\ncopy = original.copy()\ncopy.name = original.name + "_Linked"\ncopy.location.x += 3\nbpy.context.collection.objects.link(copy)\n\nassert copy.data == original.data\nprint(copy.name, "shares", copy.data.name)`,
    },
    quiz: {
      question: 'You move a mesh vertex through cube.data.vertices. A second Object shares that Mesh. What happens?',
      options: ['Only the original Object changes', 'Both Objects reflect the mesh edit', 'The second Object is deleted', 'Blender automatically makes a single-user copy'],
      answer: 1,
      explanation: 'The Mesh is shared data. Both Objects keep independent transforms, but they point to the same geometry.',
    },
  },
  {
    id: 'first-script',
    number: '02',
    module: 'orient',
    title: 'Run your first Blender script',
    shortTitle: 'Setup & first script',
    summary: 'Set up a safe scripting loop, create and link a mesh Object, and learn where Blender prints logs and reports errors.',
    duration: 25,
    level: 'Foundation',
    source: 'Book §1.1–1.5',
    outcomes: [
      'Run code from Blender’s Text Editor and Python Console.',
      'Create, name, transform, and link a new Object.',
      'Use print, tracebacks, and operator reports effectively.',
    ],
    bridge: {
      title: 'Spawning with intent',
      unreal: 'Editor scripting often spawns an Actor into the current Level with a class, transform, and spawn parameters.',
      blender: 'You can create data directly or call an operator. Direct data creation is explicit; operators often mirror UI actions and depend on context.',
      caution: 'Do not enable “Register” on untrusted Textblocks. It runs embedded code when a .blend opens. Keep auto-run disabled for files you do not trust.',
    },
    concepts: [
      {
        heading: 'Console for discovery, Text Editor for scripts',
        body: 'Use the Python Console for one-line inspection and autocomplete. Use the Text Editor for multi-line code you want to rerun. On Windows, Window → Toggle System Console reveals print output; on macOS and Linux, launch Blender from a terminal.',
      },
      {
        heading: 'Direct RNA edits are predictable',
        body: 'Setting obj.location or mesh.vertices[].co changes data without asking an operator to reconstruct the current UI context. This is often the cleanest choice for pipeline code.',
      },
      {
        heading: 'Operators are still valuable',
        body: 'bpy.ops is useful when an existing Blender tool already implements complex behavior. Learn its context requirements rather than treating every operator as a context-free function.',
      },
    ],
    steps: [
      { title: 'Enable developer affordances', body: 'In Preferences → Interface, enable Developer Extras and Python Tooltips. Tooltips now reveal useful RNA and operator paths.' },
      { title: 'Create a fresh script', body: 'Open Scripting → Text Editor → New. Paste the Blender example, then press Run Script.' },
      { title: 'Verify the result', body: 'Find “TD_Cube” in the Outliner. Move it in the viewport, then change the location values and run again.' },
    ],
    code: {
      filename: 'first_cube.py',
      unreal: `import unreal\n\nlocation = unreal.Vector(0, 0, 100)\nrotation = unreal.Rotator(0, 0, 45)\n\nactor = unreal.EditorLevelLibrary.spawn_actor_from_class(\n    unreal.StaticMeshActor,\n    location,\n    rotation,\n)\nactor.set_actor_label("TD_Cube")`,
      blender: `import bpy\nimport math\n\nmesh = bpy.data.meshes.new("TD_Cube_Mesh")\n# A unit cube, centered around its origin.\nmesh.from_pydata(\n    [(-1,-1,-1), (-1,-1,1), (-1,1,-1), (-1,1,1),\n     (1,-1,-1), (1,-1,1), (1,1,-1), (1,1,1)],\n    [],\n    [(0,4,6,2), (1,3,7,5), (0,1,5,4),\n     (2,6,7,3), (0,2,3,1), (4,5,7,6)],\n)\nmesh.update()\n\nobj = bpy.data.objects.new("TD_Cube", mesh)\nbpy.context.collection.objects.link(obj)\nobj.location = (0, 0, 1)\nobj.rotation_euler.z = math.radians(45)\n\nprint("Created:", obj.name)`,
    },
    exercise: {
      brief: 'Change the script so repeated runs do not create TD_Cube.001, TD_Cube.002, and so on. Reuse an existing Object with the exact name or remove it safely first.',
      hint: 'bpy.data.objects.get("TD_Cube") returns the Object or None. If you remove one, use bpy.data.objects.remove(obj, do_unlink=True).',
      solution: `name = "TD_Cube"\nobj = bpy.data.objects.get(name)\nif obj is None:\n    obj = bpy.data.objects.new(name, mesh)\n    bpy.context.collection.objects.link(obj)\nelse:\n    obj.data = mesh\n\nobj.location = (0, 0, 1)`,
    },
    quiz: {
      question: 'Why can print() appear invisible when a script runs in Blender’s Text Editor?',
      options: ['Python disables stdout in Blender', 'The Info editor only accepts bytes', 'Output goes to the System Console or launching terminal', 'You must convert every print to an operator'],
      answer: 2,
      explanation: 'The Text Editor and Info editor are not stdout. Open the System Console on Windows or launch Blender from a terminal.',
    },
  },
  {
    id: 'context-data',
    number: '03',
    module: 'orient',
    title: 'Selection, context & safe data edits',
    shortTitle: 'Context & selection',
    summary: 'Write tools that act on what the artist selected, validate before changing data, and avoid fragile operator context assumptions.',
    duration: 35,
    level: 'Foundation',
    source: 'Book §2.5–2.8',
    outcomes: [
      'Differentiate active and selected Objects.',
      'Filter a selection by Object type.',
      'Choose between direct data edits and bpy.ops.',
    ],
    bridge: {
      title: 'Selection is contextual in both tools',
      unreal: 'The editor exposes selected Actors, and your utility usually applies an operation to that list.',
      blender: 'bpy.context.selected_objects is the selected sequence; bpy.context.object is the single active Object. The active Object need not be the only selected one.',
      caution: 'Mode matters. A mesh edit script written for Object Mode should reject Edit Mode or deliberately switch modes with the correct context.',
    },
    concepts: [
      {
        heading: 'Validate before mutation',
        body: 'Check that a selection exists, that objects have the expected type, and that the current mode is supported. Return a useful message instead of failing halfway through a batch.',
      },
      {
        heading: 'Active is not just “first selected”',
        body: 'Blender tracks one active Object independently. Many tools use it as a source or target while treating the remaining selected Objects as inputs.',
      },
      {
        heading: 'Prefer data operations for batch work',
        body: 'Directly assigning transforms or custom properties avoids selection churn and operator overrides. Use bpy.ops when it provides behavior you should not reimplement, such as applying modifiers or complex mesh operations.',
      },
    ],
    steps: [
      { title: 'Select several different Object types', body: 'Include the Cube, Camera, and Light. Keep Cube active so you can see filtering behavior.' },
      { title: 'Run the validation code', body: 'The script selects mesh Objects from context and skips everything else without changing selection.' },
      { title: 'Test the empty state', body: 'Deselect all and run again. The guard should produce a clear RuntimeError rather than silently doing nothing.' },
    ],
    code: {
      filename: 'selected_meshes.py',
      unreal: `import unreal\n\nactors = unreal.EditorLevelLibrary.get_selected_level_actors()\nmesh_actors = [a for a in actors if isinstance(a, unreal.StaticMeshActor)]\n\nif not mesh_actors:\n    raise RuntimeError("Select at least one StaticMeshActor")\n\nfor actor in mesh_actors:\n    location = actor.get_actor_location()\n    location.z += 50.0\n    actor.set_actor_location(location, False, False)`,
      blender: `import bpy\n\nif bpy.context.mode != 'OBJECT':\n    raise RuntimeError("Run this tool in Object Mode")\n\nmesh_objects = [\n    obj for obj in bpy.context.selected_objects\n    if obj.type == 'MESH'\n]\n\nif not mesh_objects:\n    raise RuntimeError("Select at least one mesh Object")\n\nfor obj in mesh_objects:\n    # Blender uses scene units; this example assumes meters.\n    obj.location.z += 0.5\n    print(f"Moved {obj.name} to {tuple(obj.location)}")\n\nactive = bpy.context.object\nprint("Active Object:", active.name if active else None)`,
    },
    exercise: {
      brief: 'Add a custom string property called “pipeline_role” to every selected mesh and set it to “prop”. Skip non-mesh Objects and report how many were changed.',
      hint: 'ID properties use dictionary syntax: obj["pipeline_role"] = "prop".',
      solution: `count = 0\nfor obj in bpy.context.selected_objects:\n    if obj.type != 'MESH':\n        continue\n    obj["pipeline_role"] = "prop"\n    count += 1\n\nprint(f"Tagged {count} mesh Objects")`,
    },
    quiz: {
      question: 'What is the safest description of bpy.context.object?',
      options: ['A list of every selected Object', 'Always the first item in bpy.data.objects', 'The active Object in the current context', 'The mesh data of the active Actor'],
      answer: 2,
      explanation: 'It is the active Object. Selection can contain many Objects; activity identifies one focus Object.',
    },
  },
  {
    id: 'operators',
    number: '04',
    module: 'build',
    title: 'Operators are your commands',
    shortTitle: 'Custom operators',
    summary: 'Package an action as a registered Operator with validation, undo support, user feedback, and a stable bl_idname.',
    duration: 35,
    level: 'Tool building',
    source: 'Book §1.8–1.10, §4.3–4.7',
    outcomes: [
      'Create and register a custom Operator.',
      'Return FINISHED or CANCELLED correctly.',
      'Expose properties through an invoke dialog.',
    ],
    bridge: {
      title: 'Your Editor Utility action becomes an Operator',
      unreal: 'An Editor Utility Object or Blutility exposes callable actions, often with input properties and editor feedback.',
      blender: 'A bpy.types.Operator defines a command. execute() performs it; invoke() can collect input; draw() defines its dialog.',
      caution: 'bl_idname is a public API. Use a stable lowercase category.action name such as nbb.tag_meshes; renaming it breaks buttons, menus, and user scripts.',
    },
    concepts: [
      {
        heading: 'The result set is part of the contract',
        body: 'Return {"FINISHED"} only when the command completed. Return {"CANCELLED"} for invalid input or an unsupported state. Use self.report() to explain what happened in Blender’s UI.',
      },
      {
        heading: 'Undo is declared, not handwritten',
        body: 'For typical scene edits, bl_options = {"REGISTER", "UNDO"} integrates the Operator with Blender’s undo system. File writes and external side effects still need your own careful design.',
      },
      {
        heading: 'Registration makes Python classes discoverable',
        body: 'Defining an Operator class is not enough. Register it with bpy.utils.register_class and unregister in reverse order when your add-on shuts down.',
      },
    ],
    steps: [
      { title: 'Paste the Operator into the Text Editor', body: 'The script includes registration at the bottom so it can run as a standalone experiment.' },
      { title: 'Invoke it from search', body: 'In the 3D Viewport, press F3 and search “Tag Selected Meshes”. The invoke dialog exposes the role property.' },
      { title: 'Check undo and validation', body: 'Run with a valid selection, then Ctrl+Z. Run with no selection and inspect the reported warning.' },
    ],
    code: {
      filename: 'tag_operator.py',
      unreal: `import unreal\n\nclass TagSelectedActors(unreal.EditorUtilityObject):\n    role = unreal.TextProperty()\n\n    def execute(self):\n        actors = unreal.EditorLevelLibrary.get_selected_level_actors()\n        if not actors:\n            unreal.log_warning("Select at least one Actor")\n            return\n        for actor in actors:\n            actor.tags.append(unreal.Name(self.role))`,
      blender: `import bpy\nfrom bpy.props import StringProperty\nfrom bpy.types import Operator\n\nclass NBB_OT_TagMeshes(Operator):\n    bl_idname = "nbb.tag_meshes"\n    bl_label = "Tag Selected Meshes"\n    bl_options = {'REGISTER', 'UNDO'}\n\n    role: StringProperty(name="Pipeline role", default="prop")\n\n    @classmethod\n    def poll(cls, context):\n        return context.mode == 'OBJECT'\n\n    def invoke(self, context, event):\n        return context.window_manager.invoke_props_dialog(self)\n\n    def execute(self, context):\n        meshes = [o for o in context.selected_objects if o.type == 'MESH']\n        if not meshes:\n            self.report({'WARNING'}, "Select at least one mesh Object")\n            return {'CANCELLED'}\n\n        role = self.role.strip()\n        if not role:\n            self.report({'WARNING'}, "Pipeline role cannot be empty")\n            return {'CANCELLED'}\n\n        for obj in meshes:\n            obj["pipeline_role"] = role\n        self.report({'INFO'}, f"Tagged {len(meshes)} Objects")\n        return {'FINISHED'}\n\nbpy.utils.register_class(NBB_OT_TagMeshes)`,
    },
    exercise: {
      brief: 'Add a FloatProperty named “lift” with a default of 0.0. In execute(), add that value to every selected mesh’s Z location after tagging it.',
      hint: 'Import FloatProperty, declare lift: FloatProperty(name="Lift (m)"), then assign obj.location.z += self.lift.',
      solution: `from bpy.props import FloatProperty\n\n# Inside NBB_OT_TagMeshes:\nlift: FloatProperty(name="Lift (m)", default=0.0)\n\n# At the end of the mesh loop:\nobj.location.z += self.lift`,
    },
    quiz: {
      question: 'What should execute() return when no compatible Objects are selected?',
      options: ['None', '{"FINISHED"}', '{"CANCELLED"}', 'False, followed by bpy.ops.ed.undo()'],
      answer: 2,
      explanation: 'CANCELLED communicates that the command did not complete. Pair it with a useful self.report warning.',
    },
  },
  {
    id: 'properties',
    number: '05',
    module: 'build',
    title: 'Store state with RNA properties',
    shortTitle: 'Properties & UI state',
    summary: 'Model tool settings and per-scene state with typed PropertyGroups, EnumProperty, CollectionProperty, and safe accessors.',
    duration: 30,
    level: 'Tool building',
    source: 'Book §1.13, §2.9, §4.1–4.2',
    outcomes: [
      'Choose between ID properties and typed RNA properties.',
      'Attach a PropertyGroup to Scene.',
      'Keep list indices and access bounds-safe.',
    ],
    bridge: {
      title: 'Typed tool state, registered with the host',
      unreal: 'Editor Utility classes expose UPROPERTY values that the details panel can display and edit.',
      blender: 'bpy.props declarations define typed RNA properties on registered classes. A PointerProperty attaches a PropertyGroup to Scene, Object, or another ID type.',
      caution: 'Use annotations such as name: StringProperty() for Blender properties. Ordinary Python assignments do not register the same RNA interface.',
    },
    concepts: [
      {
        heading: 'Quick metadata vs structured UI state',
        body: 'ID properties like obj["role"] = "prop" are excellent for lightweight metadata. Typed RNA properties add UI drawing, ranges, enums, update callbacks, and a stable interface for your add-on.',
      },
      {
        heading: 'Collections need selection bookkeeping',
        body: 'A CollectionProperty stores repeated rows. Keep a separate IntProperty for the active row and never assume the index is still in range after a rescan or deletion.',
      },
      {
        heading: 'Dynamic enums require care',
        body: 'The NBB project updates enum items after scanning folders. Keep dynamic item generation separate from preferences to avoid circular imports, and handle the empty-item case.',
      },
    ],
    steps: [
      { title: 'Register the PropertyGroup classes', body: 'Run the example once. It attaches tool_state to every Scene through a PointerProperty.' },
      { title: 'Inspect the scene state', body: 'Evaluate bpy.context.scene.tool_state.asset_type and add a row to the assets collection.' },
      { title: 'Test the selected_asset guard', body: 'Set asset_index beyond the collection length. The accessor should return None instead of raising IndexError.' },
    ],
    code: {
      filename: 'scene_properties.py',
      unreal: `# Unreal Editor Utility properties (conceptual)\nimport unreal\n\nclass AssetBrowserState(unreal.EditorUtilityObject):\n    asset_type = unreal.TextProperty()\n    asset_index = unreal.IntProperty()\n    assets = unreal.ArrayProperty(unreal.TextProperty())`,
      blender: `import bpy\nfrom bpy.props import CollectionProperty, EnumProperty, IntProperty, StringProperty\nfrom bpy.types import PropertyGroup\n\nclass NBB_AssetItem(PropertyGroup):\n    name: StringProperty()\n    path: StringProperty(subtype='DIR_PATH')\n\nclass NBB_SceneProps(PropertyGroup):\n    asset_type: EnumProperty(\n        name="Type",\n        items=[('Props', "Props", ""), ('Environment', "Environment", "")],\n    )\n    asset_index: IntProperty(default=0)\n    assets: CollectionProperty(type=NBB_AssetItem)\n\n    @property\n    def selected_asset(self):\n        if 0 <= self.asset_index < len(self.assets):\n            return self.assets[self.asset_index]\n        return None\n\nclasses = (NBB_AssetItem, NBB_SceneProps)\nfor cls in classes:\n    bpy.utils.register_class(cls)\n\nbpy.types.Scene.tool_state = bpy.props.PointerProperty(type=NBB_SceneProps)\n\nstate = bpy.context.scene.tool_state\nrow = state.assets.add()\nrow.name = "workbench"\nprint(state.selected_asset.name)`,
    },
    exercise: {
      brief: 'Add an IntProperty called work_count to NBB_AssetItem. Constrain it to zero or greater and set the new row’s count to 3.',
      hint: 'IntProperty accepts default=0 and min=0.',
      solution: `class NBB_AssetItem(PropertyGroup):\n    name: StringProperty()\n    path: StringProperty(subtype='DIR_PATH')\n    work_count: IntProperty(default=0, min=0)\n\nrow.work_count = 3`,
    },
    quiz: {
      question: 'Why should selected_asset check asset_index before indexing the collection?',
      options: ['RNA lists cannot be indexed', 'Rescans and deletions can leave the stored index out of range', 'IntProperty only supports negative values', 'Blender requires a selection operator first'],
      answer: 1,
      explanation: 'The stored index can become stale whenever collection contents change. A bounds-checked accessor keeps UI and operators robust.',
    },
  },
  {
    id: 'panels',
    number: '06',
    module: 'build',
    title: 'Build a sidebar panel',
    shortTitle: 'Panels & artist UX',
    summary: 'Present your Operator and PropertyGroup in the 3D Viewport sidebar with clear hierarchy, conditional controls, and useful empty states.',
    duration: 30,
    level: 'Tool building',
    source: 'Book §1.11–1.12 and NBB ui/panels.py',
    outcomes: [
      'Register a Panel in the 3D View sidebar.',
      'Draw RNA properties and Operator buttons.',
      'Design useful empty and error states.',
    ],
    bridge: {
      title: 'From Editor Utility Widget to declarative layout',
      unreal: 'Editor Utility Widgets arrange controls in a visual designer and bind events to utility logic.',
      blender: 'Panel.draw() builds the layout declaratively each redraw. layout.prop draws data; layout.operator wires a button to a bl_idname.',
      caution: 'Do not perform expensive scans or file I/O in draw(). Draw runs frequently. Put work in Operators and display cached state.',
    },
    concepts: [
      {
        heading: 'Placement is class metadata',
        body: 'bl_space_type = "VIEW_3D", bl_region_type = "UI", and bl_category place the Panel in the N sidebar. bl_label is the visible heading.',
      },
      {
        heading: 'Draw state, not behavior',
        body: 'A good Panel reads context and displays current state. Buttons invoke Operators; Operators validate and mutate. This separation makes tools easier to test and reuse.',
      },
      {
        heading: 'Guide the next action',
        body: 'When no asset is selected, show a short empty state instead of a blank section. Disable impossible actions with row.enabled or avoid drawing them until their inputs exist.',
      },
    ],
    steps: [
      { title: 'Combine this lesson with the previous one', body: 'Run the scene_properties.py example first so Scene.tool_state exists, then run the Panel code.' },
      { title: 'Open the sidebar', body: 'Hover over the 3D Viewport, press N, and select the “TD Lab” tab.' },
      { title: 'Add rows and invoke actions', body: 'Use the Add demo row Operator to create data. Notice how the Panel redraws from PropertyGroup state.' },
    ],
    code: {
      filename: 'sidebar_panel.py',
      unreal: `# Editor Utility Widget (conceptual event graph)\n# [Asset Type dropdown]\n# [Asset list]\n# [Scan button] -> Call Editor Utility scan function\n# [Status text] -> Bind to scan result`,
      blender: `import bpy\nfrom bpy.types import Operator, Panel\n\nclass NBB_OT_AddDemoAsset(Operator):\n    bl_idname = "nbb.add_demo_asset"\n    bl_label = "Add Demo Row"\n    bl_options = {'REGISTER', 'UNDO'}\n\n    def execute(self, context):\n        state = context.scene.tool_state\n        item = state.assets.add()\n        item.name = f"asset_{len(state.assets):03d}"\n        state.asset_index = len(state.assets) - 1\n        return {'FINISHED'}\n\nclass NBB_PT_TdLab(Panel):\n    bl_label = "Asset Prep"\n    bl_space_type = 'VIEW_3D'\n    bl_region_type = 'UI'\n    bl_category = "TD Lab"\n\n    def draw(self, context):\n        layout = self.layout\n        state = context.scene.tool_state\n        layout.prop(state, "asset_type")\n        layout.operator("nbb.add_demo_asset", icon='ADD')\n        layout.operator("nbb.tag_meshes", icon='CHECKMARK')\n\n        if not state.assets:\n            layout.label(text="No assets yet. Add a demo row.", icon='INFO')\n            return\n\n        layout.template_list(\n            "UI_UL_list", "assets", state, "assets",\n            state, "asset_index", rows=4,\n        )\n        selected = state.selected_asset\n        if selected:\n            layout.label(text=f"Selected: {selected.name}")\n\nfor cls in (NBB_OT_AddDemoAsset, NBB_PT_TdLab):\n    bpy.utils.register_class(cls)`,
    },
    exercise: {
      brief: 'Add a second column beside “Add Demo Row” containing the existing nbb.tag_meshes Operator. Make both buttons align in one row.',
      hint: 'Use row = layout.row(align=True), then call row.operator(...) twice.',
      solution: `row = layout.row(align=True)\nrow.operator("nbb.add_demo_asset", icon='ADD')\nrow.operator("nbb.tag_meshes", icon='CHECKMARK')`,
    },
    quiz: {
      question: 'Where should a slow folder scan run?',
      options: ['Inside Panel.draw()', 'Inside a property getter', 'Inside an Operator invoked by a button', 'Inside a Python Console autocomplete callback'],
      answer: 2,
      explanation: 'Draw code runs repeatedly and must stay cheap. Trigger the scan from an Operator and store results for the Panel to display.',
    },
  },
  {
    id: 'addon-package',
    number: '07',
    module: 'build',
    title: 'Package a real add-on',
    shortTitle: 'Add-on structure & lifecycle',
    summary: 'Move beyond one-file experiments into a package with bl_info, deterministic registration, preferences, and a reliable development reload loop.',
    duration: 40,
    level: 'Tool building',
    source: 'Book §3.1–3.6 and NBB __init__.py',
    outcomes: [
      'Create an installable add-on package.',
      'Register and unregister classes in a safe order.',
      'Separate user preferences from per-scene state.',
    ],
    bridge: {
      title: 'A plugin lifecycle you already understand',
      unreal: 'A plugin has metadata, startup/shutdown behavior, modules, and project or editor settings.',
      blender: 'An add-on package has bl_info and register()/unregister(). AddonPreferences stores user configuration; Scene PropertyGroups store per-file tool state.',
      caution: 'unregister() must undo register(). Remove attached PointerProperty attributes and unregister classes in reverse order to avoid stale RNA and reload errors.',
    },
    concepts: [
      {
        heading: 'Keep Blender code at the edges',
        body: 'The NBB add-on separates providers (pure Python), properties (RNA), operators (actions), UI (drawing), and library file operations. This is the same maintainability instinct as keeping Unreal editor UI away from core asset logic.',
      },
      {
        heading: 'Reloading modules is not the same as re-executing one file',
        body: 'A package can keep old submodules in sys.modules. The supplied NBB project reloads child modules during development. Use a deliberate reload routine and expect to restart Blender when lifecycle state becomes inconsistent.',
      },
      {
        heading: 'Use a junction for live development',
        body: 'Your project links the source package into Blender’s add-ons directory, keeping one authoritative copy. Avoid Install from Disk for this loop because it copies files and can leave you editing a stale version.',
      },
    ],
    steps: [
      { title: 'Create the package layout', body: 'Start with __init__.py, properties.py, operators.py, and ui.py. Keep the first version small enough to reason about registration.' },
      { title: 'Link the development package', body: 'On Windows, create a directory junction from Blender’s scripts/addons folder to your source package, then enable it in Preferences.' },
      { title: 'Test both directions', body: 'Disable and re-enable the add-on. Verify that the Panel disappears and returns without “already registered” errors.' },
    ],
    code: {
      filename: '__init__.py',
      unreal: `# Unreal plugin shape (conceptual)\n# MyPlugin.uplugin       -> plugin metadata\n# StartupModule()        -> register commands and UI\n# ShutdownModule()       -> remove commands and UI\n# EditorUtilityWidget    -> artist-facing interface\n# DeveloperSettings      -> packaged user configuration`,
      blender: `bl_info = {\n    "name": "TD Asset Lab",\n    "author": "Your Name",\n    "version": (0, 1, 0),\n    "blender": (4, 2, 0),\n    "location": "View3D > Sidebar > TD Lab",\n    "category": "Pipeline",\n}\n\nimport bpy\nfrom . import operators, preferences, properties, ui\n\nclasses = (\n    preferences.classes\n    + properties.classes\n    + operators.classes\n    + ui.classes\n)\n\ndef register():\n    for cls in classes:\n        bpy.utils.register_class(cls)\n    bpy.types.Scene.tool_state = bpy.props.PointerProperty(\n        type=properties.NBB_SceneProps\n    )\n\ndef unregister():\n    del bpy.types.Scene.tool_state\n    for cls in reversed(classes):\n        bpy.utils.unregister_class(cls)\n\nif __name__ == "__main__":\n    register()`,
    },
    exercise: {
      brief: 'Write the PowerShell junction command for a package at E:\\BlenderProjects\\td_asset_lab and Blender 5.2 for your user. Use a placeholder for the username if needed.',
      hint: 'Use mklink /J "link" "target". The link belongs under Blender Foundation\\Blender\\5.2\\scripts\\addons.',
      solution: `mklink /J "C:\\Users\\<you>\\AppData\\Roaming\\Blender Foundation\\Blender\\5.2\\scripts\\addons\\td_asset_lab" "E:\\BlenderProjects\\td_asset_lab"`,
    },
    quiz: {
      question: 'Why does unregister() iterate classes in reverse?',
      options: ['It makes Python imports faster', 'Dependencies are torn down in the opposite order from registration', 'Blender only unregisters the last class', 'It alphabetizes bl_idname values'],
      answer: 1,
      explanation: 'Reverse teardown mirrors construction and reduces lifecycle errors, especially for PropertyGroups referenced by other registered classes.',
    },
  },
  {
    id: 'nbb-architecture',
    number: '08',
    module: 'production',
    title: 'Anatomy of your NBB Asset Manager',
    shortTitle: 'Production architecture',
    summary: 'Read your own add-on as a layered system: provider, RNA state, Operators, UI, preferences, and file operations.',
    duration: 35,
    level: 'Production',
    source: 'Your NBB Asset Manager source',
    outcomes: [
      'Trace a button click through the full add-on.',
      'Explain why providers are intentionally bpy-free.',
      'Identify seams for ShotGrid, AYON, or Unreal export.',
    ],
    bridge: {
      title: 'Pipeline architecture transfers directly',
      unreal: 'A production utility commonly separates editor presentation, asset operations, and external source-control or asset-database services.',
      blender: 'NBB separates Panel drawing from Operators and puts folder discovery behind AssetProviderBase. A future ShotGrid provider can plug in without rewriting the Panel.',
      caution: 'The provider is testable because it avoids bpy. Keep that boundary: passing Blender RNA objects into it would couple folder logic to a running Blender session.',
    },
    concepts: [
      {
        heading: 'Follow nbb.scan_assets',
        body: 'NBB_PT_AssetManager draws a button with bl_idname nbb.scan_assets. NBB_OT_ScanAssets gets a provider from preferences, clears RNA collections, scans types and assets, writes rows into Scene state, populates versions, and reports a result.',
      },
      {
        heading: 'The provider is a replaceable data source',
        body: 'FolderScanProvider implements scan_types, scan_assets, get_asset, next_work_version, and ensure_asset_dirs. Tomorrow, a ShotGrid implementation can satisfy the same contract while Operators continue to speak the same language.',
      },
      {
        heading: 'Configuration is layered and explicit',
        body: 'Shipped TOML defaults combine with environment-specified overrides. Preferences expose the project root. Missing or malformed configuration fails fast instead of silently selecting a surprising production folder.',
      },
    ],
    steps: [
      { title: 'Start at ui/panels.py', body: 'Find box.operator("nbb.scan_assets"). Follow that identifier to operators/assets.py rather than reading files alphabetically.' },
      { title: 'Trace the data boundary', body: 'Inspect preferences.get_provider(), providers/base.py, and folder_scan.py. Note that AssetInfo is plain Python, not RNA.' },
      { title: 'Return to Scene state', body: 'See how the Operator fills NBB_SceneProps.assets and versions. The Panel simply displays that state on its next draw.' },
    ],
    code: {
      filename: 'provider_boundary.py',
      unreal: `# A familiar service boundary (conceptual)\nclass AssetSource:\n    def list_assets(self, asset_type): ...\n\nclass ContentBrowserSource(AssetSource): ...\nclass ShotGridSource(AssetSource): ...\n\n# UI and commands depend on AssetSource,\n# not on a concrete filesystem or web service.`,
      blender: `# Simplified from your NBB provider contract.\n# This file deliberately imports no bpy.\nfrom abc import ABC, abstractmethod\n\nclass AssetInfo:\n    def __init__(self, name, type_name, path):\n        self.name = name\n        self.type_name = type_name\n        self.path = path\n        self.work_versions = []\n        self.publish_versions = []\n\nclass AssetProviderBase(ABC):\n    @abstractmethod\n    def scan_types(self): ...\n\n    @abstractmethod\n    def scan_assets(self, type_name): ...\n\n    @abstractmethod\n    def next_work_version(self, asset): ...\n\n# Operator edge: depends on the abstraction.\ndef scan_into_scene(context, provider):\n    state = context.scene.nbb_am\n    state.assets.clear()\n    for asset in provider.scan_assets(state.asset_type):\n        row = state.assets.add()\n        row.name = asset.name\n        row.asset_path = asset.path\n    return len(state.assets)`,
    },
    exercise: {
      brief: 'Sketch a ShotGridProvider class with the same three abstract methods shown. Do not implement networking; define the inputs and return shapes you would need.',
      hint: 'Keep AssetInfo as the return model. Avoid importing bpy or passing context into the provider constructor.',
      solution: `class ShotGridProvider(AssetProviderBase):\n    def __init__(self, client, project_id):\n        self.client = client\n        self.project_id = project_id\n\n    def scan_types(self):\n        # Query and return sorted list[str].\n        ...\n\n    def scan_assets(self, type_name):\n        # Query and return list[AssetInfo].\n        ...\n\n    def next_work_version(self, asset):\n        # Return (version_int, filename).\n        ...`,
    },
    quiz: {
      question: 'What is the main benefit of keeping providers bpy-free?',
      options: ['It enables Blender gizmos', 'Folder or service logic stays independently testable and replaceable', 'It automatically registers Operators', 'It removes the need for error handling'],
      answer: 1,
      explanation: 'Pure Python boundaries can be tested without Blender and swapped behind a stable contract without rewriting UI code.',
    },
  },
  {
    id: 'capstone',
    number: '09',
    module: 'production',
    title: 'Capstone: batch asset-prep tool',
    shortTitle: 'Capstone asset prep',
    summary: 'Combine selection, mathutils, validation, Operator properties, undo, and a Panel into one artist-ready batch tool.',
    duration: 45,
    level: 'Production',
    source: 'Synthesis of lessons 01–08; book §5.1–5.4',
    outcomes: [
      'Apply a consistent transform workflow to many Objects.',
      'Use mathutils without confusing local and world transforms.',
      'Ship a focused Operator with validation and undo.',
    ],
    bridge: {
      title: 'A batch utility with production guardrails',
      unreal: 'You might iterate selected StaticMeshActors, normalize pivots or transforms, tag assets, and log a summary.',
      blender: 'The capstone processes selected mesh Objects, applies uniform scale in local units, tags metadata, and reports skipped inputs without relying on selection-changing operators.',
      caution: 'Unreal commonly works in centimeters; Blender’s default scene unit is meter-based. Establish a pipeline unit convention and test matrices at system boundaries instead of sprinkling arbitrary 0.01 factors.',
    },
    concepts: [
      {
        heading: 'Know which transform you are editing',
        body: 'obj.location, rotation_euler, and scale are local transform channels. obj.matrix_world is the evaluated world transform including parents. Use matrix_world when aligning or measuring across different parents.',
      },
      {
        heading: 'Batch tools need a summary',
        body: 'Count processed and skipped Objects. A concise report helps artists detect an empty or incompatible selection without reading a console log.',
      },
      {
        heading: 'Extend vertically, not all at once',
        body: 'First make the Operator reliable. Then add a Panel button. Only after that add naming rules, export, source control, or a provider. Small vertical slices keep every addition testable.',
      },
    ],
    steps: [
      { title: 'Run the capstone in a disposable scene', body: 'Select several mesh Objects plus a Camera. The Camera should be skipped, not modified.' },
      { title: 'Invoke from F3', body: 'Search “Prepare Selected Assets”. Set a uniform scale and pipeline role, then execute.' },
      { title: 'Test failure and undo', body: 'Try an empty selection and a scale of zero. After a successful run, use Ctrl+Z to verify the Operator’s undo integration.' },
    ],
    code: {
      filename: 'asset_prep.py',
      unreal: `import unreal\n\nactors = unreal.EditorLevelLibrary.get_selected_level_actors()\nprocessed = 0\nfor actor in actors:\n    if not isinstance(actor, unreal.StaticMeshActor):\n        continue\n    scale = actor.get_actor_scale3d()\n    actor.set_actor_scale3d(scale * 1.0)\n    actor.tags.append(unreal.Name("hero_prop"))\n    processed += 1\n\nunreal.log(f"Prepared {processed} Actors")`,
      blender: `import bpy\nfrom bpy.props import FloatProperty, StringProperty\nfrom bpy.types import Operator\n\nclass NBB_OT_PrepareAssets(Operator):\n    bl_idname = "nbb.prepare_assets"\n    bl_label = "Prepare Selected Assets"\n    bl_options = {'REGISTER', 'UNDO'}\n\n    uniform_scale: FloatProperty(\n        name="Uniform scale", default=1.0, min=0.001, soft_max=100.0,\n    )\n    role: StringProperty(name="Pipeline role", default="hero_prop")\n\n    @classmethod\n    def poll(cls, context):\n        return context.mode == 'OBJECT'\n\n    def invoke(self, context, event):\n        return context.window_manager.invoke_props_dialog(self)\n\n    def execute(self, context):\n        if not self.role.strip():\n            self.report({'WARNING'}, "Enter a pipeline role")\n            return {'CANCELLED'}\n\n        selected = list(context.selected_objects)\n        meshes = [obj for obj in selected if obj.type == 'MESH']\n        if not meshes:\n            self.report({'WARNING'}, "Select at least one mesh Object")\n            return {'CANCELLED'}\n\n        for obj in meshes:\n            obj.scale *= self.uniform_scale\n            obj["pipeline_role"] = self.role.strip()\n            obj["prepared_by"] = "NBB Asset Prep"\n\n        skipped = len(selected) - len(meshes)\n        self.report(\n            {'INFO'},\n            f"Prepared {len(meshes)} meshes; skipped {skipped} Objects",\n        )\n        return {'FINISHED'}\n\nbpy.utils.register_class(NBB_OT_PrepareAssets)`,
    },
    exercise: {
      brief: 'Add a BoolProperty called “apply_location_offset”. When enabled, move each mesh upward by 0.5 scene units along world Z, even if it has a rotated parent.',
      hint: 'World-space translation can be applied as obj.matrix_world.translation.z += 0.5. Read the transform once, modify it, then assign it back if you change the matrix itself.',
      solution: `from bpy.props import BoolProperty\n\napply_location_offset: BoolProperty(\n    name="Lift in world space", default=False,\n)\n\n# Inside the mesh loop:\nif self.apply_location_offset:\n    world = obj.matrix_world.copy()\n    world.translation.z += 0.5\n    obj.matrix_world = world`,
    },
    quiz: {
      question: 'Why edit matrix_world for a world-space lift on a parented Object?',
      options: ['matrix_world always clears the parent', 'Local Z may not align with world Z under a rotated parent', 'Object.location cannot store floats', 'It automatically applies all modifiers'],
      answer: 1,
      explanation: 'Local axes depend on the parent and rotation. Editing the world matrix expresses the offset in world coordinates; Blender resolves the local transform on assignment.',
    },
  },
]

export const totalMinutes = lessons.reduce((sum, lesson) => sum + lesson.duration, 0)
