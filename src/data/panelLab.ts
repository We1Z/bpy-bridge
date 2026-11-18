export type PanelPiece = {
  id: string
  label: string
  shortLabel: string
  lines: string
  title: string
  summary: string
  explanation: string
  unreal: string
  flow: [string, string, string]
  code: string
}

export const panelPieces: PanelPiece[] = [
  {
    id: 'shell',
    label: 'Panel placement',
    shortLabel: 'Shell',
    lines: '8–17',
    title: 'Register the panel in the 3D View sidebar',
    summary: 'The class tells Blender where the UI lives. draw() then declares its contents whenever the region redraws.',
    explanation: 'bl_space_type selects the 3D Viewport, bl_region_type selects its sidebar, and bl_category creates the NBB Assets tab. The draw method receives the current context and reads scene state plus add-on preferences.',
    unreal: 'Similar to choosing where an Editor Utility Widget appears, except Blender reconstructs the layout declaratively instead of storing a designed widget tree.',
    flow: ['Panel class', 'VIEW_3D → UI', 'NBB Assets tab'],
    code: `class NBB_PT_AssetManager(Panel):
    bl_label = "NBB Asset Manager"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "NBB Assets"

    def draw(self, context):
        layout = self.layout
        scn = context.scene.nbb_am
        prefs = context.preferences.addons[ADDON_PACKAGE].preferences`,
  },
  {
    id: 'project',
    label: 'Project controls',
    shortLabel: 'Project',
    lines: '19–26',
    title: 'Group configuration and the scan command',
    summary: 'A box groups the project path, scan button, and optional status message into one visual unit.',
    explanation: 'box.prop() edits the persistent project_root preference. box.operator() invokes nbb.scan_assets. The status label is conditional: it only appears when scene state contains a message.',
    unreal: 'This resembles an Editor Utility details row bound to a setting, plus a button that calls an Editor Utility action.',
    flow: ['layout.box()', 'prefs + nbb.scan_assets', 'Project feedback'],
    code: `# Project root
box = layout.box()
box.label(text="Project", icon="FILE_FOLDER")
box.prop(prefs, "project_root", text="")
box.operator("nbb.scan_assets", icon="FILE_REFRESH")

if scn.status_message:
    box.label(text=scn.status_message, icon="INFO")`,
  },
  {
    id: 'type',
    label: 'Asset type',
    shortLabel: 'Type',
    lines: '28–30',
    title: 'Draw an enum property as a selector',
    summary: 'One row.prop call exposes the asset_type RNA property with the visible label Type.',
    explanation: 'The Panel does not build dropdown items manually. Blender inspects the registered EnumProperty and supplies the appropriate control. Editing it updates context.scene.nbb_am.asset_type.',
    unreal: 'The closest equivalent is binding an Editor Utility Widget combo box to an enum UPROPERTY.',
    flow: ['layout.row()', 'scn.asset_type', 'Enum selector'],
    code: `# Asset type
row = layout.row()
row.prop(scn, "asset_type", text="Type")`,
  },
  {
    id: 'assets',
    label: 'Asset list',
    shortLabel: 'Assets',
    lines: '32–39',
    title: 'Combine a list with a vertical tool column',
    summary: 'template_list draws the collection and selection. A nested aligned column places New and Open Folder beside it.',
    explanation: 'NBB_UL_AssetList controls each row’s appearance. The collection and active index come from scn.assets and scn.asset_index. The two compact operator buttons act on that scene state.',
    unreal: 'Think of a ListView bound to an asset array, with a small toolbar for utility actions.',
    flow: ['template_list()', 'scn.assets + asset_index', 'Selection & tools'],
    code: `# Asset list
row = layout.row()
row.template_list(
    "NBB_UL_AssetList", "", scn, "assets", scn, "asset_index", rows=5
)
col = row.column(align=True)
col.operator("nbb.new_asset", icon="ADD", text="")
col.operator("nbb.open_explorer", icon="FILE_FOLDER", text="")`,
  },
  {
    id: 'versions',
    label: 'Version list',
    shortLabel: 'Versions',
    lines: '41–50',
    title: 'Reveal versions only for a selected asset',
    summary: 'The selected_asset accessor guards the entire box. Its title updates from the selected asset name.',
    explanation: 'A second template_list binds scn.versions and scn.version_index. The refresh operator sits on the same row. If no asset is selected, none of this UI is drawn.',
    unreal: 'This is like a details panel whose visibility and bound version array depend on the current asset selection.',
    flow: ['if selected_asset', 'scn.versions + version_index', 'Version browser'],
    code: `# Versions
asset = scn.selected_asset
if asset:
    box = layout.box()
    box.label(text=f"Versions: {asset.name}", icon="FILE_BLEND")
    row = box.row()
    row.template_list(
        "NBB_UL_VersionList", "", scn, "versions", scn, "version_index", rows=5
    )
    row.operator("nbb.refresh_versions", icon="FILE_REFRESH", text="")`,
  },
  {
    id: 'actions',
    label: 'Version actions',
    shortLabel: 'Actions',
    lines: '52–57',
    title: 'Guard selection and expose only valid actions',
    summary: 'Load appears for a valid selected version. Publish appears only when that version’s source is work.',
    explanation: 'The bounds check prevents an invalid collection access. Setting .filepath on the Load operator button passes the selected path into its invocation. The source check keeps release actions contextual.',
    unreal: 'Equivalent to enabling details-panel actions from the selected revision and hiding Publish for already published revisions.',
    flow: ['Valid version_index', 'ver.path + ver.source', 'Load / Publish'],
    code: `if 0 <= scn.version_index < len(scn.versions):
    ver = scn.versions[scn.version_index]
    row = box.row(align=True)
    row.operator("nbb.load_version", icon="IMPORT").filepath = ver.path
    if ver.source == "work":
        row.operator("nbb.publish_version", icon="CHECKMARK")`,
  },
  {
    id: 'save',
    label: 'Save work version',
    shortLabel: 'Save',
    lines: '59–60',
    title: 'Finish with one clear primary command',
    summary: 'A full-width operator saves a work version while an asset is selected.',
    explanation: 'This call is still inside if asset, but outside the version-selection guard. It remains available when the asset has no valid selected version. Its bl_idname connects the button to the save operator.',
    unreal: 'Like a primary Editor Utility button that creates a new working revision for the current asset.',
    flow: ['layout.operator()', 'nbb.save_work_version', 'New work version'],
    code: `# Save work version
layout.operator("nbb.save_work_version", icon="FILE_TICK")`,
  },
]

export const panelSource = `"""N-panel for the asset manager."""

from bpy.types import Panel

from ..config import ADDON_PACKAGE


class NBB_PT_AssetManager(Panel):
    bl_label = "NBB Asset Manager"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "NBB Assets"

    def draw(self, context):
        layout = self.layout
        scn = context.scene.nbb_am
        prefs = context.preferences.addons[ADDON_PACKAGE].preferences

        # Project root
        box = layout.box()
        box.label(text="Project", icon="FILE_FOLDER")
        box.prop(prefs, "project_root", text="")
        box.operator("nbb.scan_assets", icon="FILE_REFRESH")

        if scn.status_message:
            box.label(text=scn.status_message, icon="INFO")

        # Asset type
        row = layout.row()
        row.prop(scn, "asset_type", text="Type")

        # Asset list
        row = layout.row()
        row.template_list(
            "NBB_UL_AssetList", "", scn, "assets", scn, "asset_index", rows=5
        )
        col = row.column(align=True)
        col.operator("nbb.new_asset", icon="ADD", text="")
        col.operator("nbb.open_explorer", icon="FILE_FOLDER", text="")

        # Versions
        asset = scn.selected_asset
        if asset:
            box = layout.box()
            box.label(text=f"Versions: {asset.name}", icon="FILE_BLEND")
            row = box.row()
            row.template_list(
                "NBB_UL_VersionList", "", scn, "versions", scn, "version_index", rows=5
            )
            row.operator("nbb.refresh_versions", icon="FILE_REFRESH", text="")

            if 0 <= scn.version_index < len(scn.versions):
                ver = scn.versions[scn.version_index]
                row = box.row(align=True)
                row.operator("nbb.load_version", icon="IMPORT").filepath = ver.path
                if ver.source == "work":
                    row.operator("nbb.publish_version", icon="CHECKMARK")

            # Save work version
            layout.operator("nbb.save_work_version", icon="FILE_TICK")


classes = (NBB_PT_AssetManager,)`
