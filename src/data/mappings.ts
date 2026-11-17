export type ApiMapping = {
  id: string
  category: 'Scene' | 'Assets' | 'UI' | 'Math' | 'Workflow'
  task: string
  unreal: string
  blender: string
  note: string
}

export const apiMappings: ApiMapping[] = [
  {
    id: 'scene-objects', category: 'Scene', task: 'List scene contents',
    unreal: 'unreal.EditorLevelLibrary.get_all_level_actors()',
    blender: 'bpy.context.scene.objects',
    note: 'Both are editor-context queries. Blender also exposes file-wide data through bpy.data.objects.',
  },
  {
    id: 'selection', category: 'Scene', task: 'Get selected scene items',
    unreal: 'unreal.EditorLevelLibrary.get_selected_level_actors()',
    blender: 'bpy.context.selected_objects',
    note: 'Use bpy.context.object separately when you need the single active Object.',
  },
  {
    id: 'active', category: 'Scene', task: 'Get the active item',
    unreal: 'Selection list + your own primary-Actor convention',
    blender: 'bpy.context.object',
    note: 'Blender tracks an active Object independently from the selected Object list.',
  },
  {
    id: 'mesh-filter', category: 'Scene', task: 'Filter for mesh items',
    unreal: 'isinstance(actor, unreal.StaticMeshActor)',
    blender: "obj.type == 'MESH'",
    note: 'Blender Object.type identifies the type-specific data attached to the Object.',
  },
  {
    id: 'create-object', category: 'Scene', task: 'Create scene content',
    unreal: 'unreal.EditorLevelLibrary.spawn_actor_from_class(...)',
    blender: 'bpy.data.objects.new(...) + collection.objects.link(...)',
    note: 'Direct Blender data creation needs an explicit collection link. Operators provide another creation path.',
  },
  {
    id: 'location', category: 'Math', task: 'Read or set a position',
    unreal: 'actor.get_actor_location() / set_actor_location(...)',
    blender: 'obj.location / obj.matrix_world.translation',
    note: 'Use local channels for local edits and matrix_world for world-space operations.',
  },
  {
    id: 'vector', category: 'Math', task: 'Work with vectors',
    unreal: 'unreal.Vector(x, y, z)',
    blender: 'mathutils.Vector((x, y, z))',
    note: 'Both support vector arithmetic. Confirm coordinate and unit conventions at DCC boundaries.',
  },
  {
    id: 'rotation', category: 'Math', task: 'Work with rotations',
    unreal: 'unreal.Rotator(pitch, yaw, roll)',
    blender: 'obj.rotation_euler / mathutils.Quaternion / mathutils.Matrix',
    note: 'Rotation order and axes matter. Use matrices at interchange boundaries instead of assuming matching Euler fields.',
  },
  {
    id: 'metadata', category: 'Assets', task: 'Attach lightweight metadata',
    unreal: 'actor.tags.append(unreal.Name(value))',
    blender: 'obj["pipeline_role"] = value',
    note: 'Blender ID properties are dictionary-like. Use typed RNA properties for structured add-on UI state.',
  },
  {
    id: 'panel', category: 'UI', task: 'Build an artist tool panel',
    unreal: 'Editor Utility Widget + bound utility events',
    blender: 'bpy.types.Panel.draw()',
    note: 'Blender layouts are declared in Python on redraw. Keep drawing cheap and put actions in Operators.',
  },
  {
    id: 'command', category: 'UI', task: 'Expose an undoable command',
    unreal: 'Editor Utility action + editor transaction scope',
    blender: "bpy.types.Operator + bl_options = {'REGISTER', 'UNDO'}",
    note: 'External file side effects still need explicit recovery design; undo is not a transaction system for your whole pipeline.',
  },
  {
    id: 'dialog', category: 'UI', task: 'Collect command input',
    unreal: 'Editor Utility properties or a modal widget',
    blender: 'Operator.invoke() + window_manager.invoke_props_dialog(self)',
    note: 'Declare Operator properties with bpy.props and optionally customize the dialog in draw().',
  },
  {
    id: 'logging', category: 'Workflow', task: 'Report progress and problems',
    unreal: 'unreal.log() / unreal.log_warning()',
    blender: "print() / self.report({'INFO'|'WARNING'|'ERROR'}, ...)",
    note: 'print goes to the System Console or terminal. Operator reports surface in Blender’s UI.',
  },
  {
    id: 'progress', category: 'Workflow', task: 'Show a long-task progress bar',
    unreal: 'unreal.ScopedSlowTask(...)',
    blender: 'context.window_manager.progress_begin() / progress_update() / progress_end()',
    note: 'Always end progress in a finally block. For truly long work, consider a modal Operator or background job design.',
  },
  {
    id: 'discovery', category: 'Workflow', task: 'Discover the live API',
    unreal: 'Python help(), stubs, and Unreal API docs',
    blender: 'dir(obj), obj.bl_rna, Python Tooltips, and Blender API docs',
    note: 'Blender’s RNA metadata is especially useful for inspecting properties and their descriptions at runtime.',
  },
]
