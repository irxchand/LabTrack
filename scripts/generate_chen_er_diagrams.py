"""
LabTrack - Advanced Chen Entity-Relationship Diagram Generator (TerraER Publication Quality)
Fixes all visual overlaps and ensures clean, publication-grade aesthetics.
Outputs:
1. docs/database/er-model/LabTrack_Chen_Enhanced_Slide06.svg & .png
2. docs/database/er-model/LabTrack_Chen_Full_Academic_Model.svg & .png
3. docs/database/er-model/LabTrack_Chen_Slide06.mmd
4. docs/database/er-model/LabTrack_Chen_Full_Academic.mmd
"""

import os
import math
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Ellipse, Polygon

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "database", "er-model")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Academic Color Palette
CLR_CANVAS = '#FFFFFF'
CLR_NAVY = '#16283F'
CLR_TEAL = '#0D9488'
CLR_TEAL_DARK = '#0F766E'
CLR_ENTITY_BG = '#F3F7FA'
CLR_REL_BG = '#E8F6F4'
CLR_ATTR_BG = '#FFFFFF'
CLR_ATTR_BORDER = '#64748B'
CLR_LINE = '#334155'
CLR_CARD = '#1E293B'
CLR_NOTE = '#475569'

def draw_entity(ax, x, y, w, h, name, is_associative=False, is_weak=False):
    """Draws a Chen entity box. Associative entities receive a double rectangle."""
    if is_associative or is_weak:
        ax.add_patch(patches.Rectangle((x, y), w, h, facecolor=CLR_ENTITY_BG, edgecolor=CLR_TEAL, linewidth=1.6, zorder=2))
        pad = 0.9
        ax.add_patch(patches.Rectangle((x + pad, y + pad), w - 2*pad, h - 2*pad, facecolor='none', edgecolor=CLR_TEAL, linewidth=1.2, zorder=3))
        ax.text(x + w/2, y + h/2 + 1.1, name, ha='center', va='center', fontsize=9, fontweight='bold', color=CLR_NAVY, zorder=4)
        ax.text(x + w/2, y + h/2 - 1.2, "«associative»", ha='center', va='center', fontsize=6.8, fontstyle='italic', color=CLR_TEAL_DARK, zorder=4)
    else:
        ax.add_patch(patches.Rectangle((x, y), w, h, facecolor=CLR_ENTITY_BG, edgecolor=CLR_TEAL, linewidth=1.8, zorder=2))
        ax.text(x + w/2, y + h/2, name, ha='center', va='center', fontsize=9.5, fontweight='bold', color=CLR_NAVY, zorder=4)

def draw_relationship(ax, cx, cy, rx, ry, name, is_identifying=False):
    """Draws a Chen relationship diamond."""
    pts = [(cx, cy + ry), (cx + rx, cy), (cx, cy - ry), (cx - rx, cy)]
    ax.add_patch(Polygon(pts, facecolor=CLR_REL_BG, edgecolor=CLR_TEAL, linewidth=1.6, zorder=2))

    if is_identifying:
        pad_x = rx * 0.82
        pad_y = ry * 0.82
        pts_inner = [(cx, cy + pad_y), (cx + pad_x, cy), (cx, cy - pad_y), (cx - pad_x, cy)]
        ax.add_patch(Polygon(pts_inner, facecolor='none', edgecolor=CLR_TEAL, linewidth=1.2, zorder=3))

    ax.text(cx, cy, name, ha='center', va='center', fontsize=7.8, fontweight='bold', color=CLR_TEAL_DARK, zorder=4)

def draw_attribute(ax, cx, cy, rx, ry, name, attr_type='simple', parent_pos=None):
    """Draws an attribute oval with Chen semantics."""
    if parent_pos:
        ax.plot([parent_pos[0], cx], [parent_pos[1], cy], color=CLR_ATTR_BORDER, linewidth=0.9, linestyle='-', zorder=1)

    if attr_type == 'multivalued':
        ax.add_patch(Ellipse((cx, cy), rx*2, ry*2, facecolor=CLR_ATTR_BG, edgecolor=CLR_ATTR_BORDER, linewidth=1.3, zorder=2))
        ax.add_patch(Ellipse((cx, cy), rx*1.65, ry*1.65, facecolor='none', edgecolor=CLR_ATTR_BORDER, linewidth=1.0, zorder=3))
    elif attr_type == 'derived':
        ax.add_patch(Ellipse((cx, cy), rx*2, ry*2, facecolor=CLR_ATTR_BG, edgecolor=CLR_TEAL, linewidth=1.4, linestyle='--', zorder=2))
    else:
        ax.add_patch(Ellipse((cx, cy), rx*2, ry*2, facecolor=CLR_ATTR_BG, edgecolor=CLR_ATTR_BORDER, linewidth=1.1, zorder=2))

    t = ax.text(cx, cy, name, ha='center', va='center', fontsize=7.0, color=CLR_NAVY, zorder=4)
    if attr_type == 'pk':
        t.set_fontweight('bold')
        uw = rx * 0.65
        ax.plot([cx - uw, cx + uw], [cy - ry*0.48, cy - ry*0.48], color=CLR_NAVY, linewidth=1.1, zorder=4)
    elif attr_type == 'ak':
        uw = rx * 0.65
        ax.plot([cx - uw, cx + uw], [cy - ry*0.48, cy - ry*0.48], color=CLR_TEAL_DARK, linewidth=1.0, linestyle=':', zorder=4)

def draw_connector(ax, p1, p2, is_total=False, label1=None, label2=None, pos1_adj=(0,0), pos2_adj=(0,0), is_dashed=False):
    """Draws relationship connections with total (double line) or partial (single line) participation."""
    x1, y1 = p1
    x2, y2 = p2

    if is_dashed:
        ax.plot([x1, x2], [y1, y2], color='#D97706', linewidth=1.4, linestyle='--', zorder=1)
    elif is_total:
        dx = x2 - x1
        dy = y2 - y1
        length = math.hypot(dx, dy)
        if length > 0:
            offset = 0.38
            nx = -dy / length * offset
            ny = dx / length * offset
            ax.plot([x1 + nx, x2 + nx], [y1 + ny, y2 + ny], color=CLR_LINE, linewidth=1.2, zorder=1)
            ax.plot([x1 - nx, x2 - nx], [y1 - ny, y2 - ny], color=CLR_LINE, linewidth=1.2, zorder=1)
    else:
        ax.plot([x1, x2], [y1, y2], color=CLR_LINE, linewidth=1.3, zorder=1)

    if label1:
        ax.text(x1 + pos1_adj[0], y1 + pos1_adj[1], label1, fontsize=8.0, fontweight='bold', color=CLR_CARD, zorder=5)
    if label2:
        ax.text(x2 + pos2_adj[0], y2 + pos2_adj[1], label2, fontsize=8.0, fontweight='bold', color=CLR_CARD, zorder=5)

def build_legend(ax, lx, ly):
    """Draws an authoritative TerraER notation legend."""
    ax.add_patch(FancyBboxPatch((lx, ly), 44, 20, boxstyle="round,pad=0.6", facecolor='#F8FAFC', edgecolor='#CBD5E1', linewidth=1.1, zorder=10))
    ax.text(lx + 22, ly + 18.0, "CHEN ER MODELLING CONVENTIONS (TerraER)", ha='center', va='center', fontsize=8.0, fontweight='bold', color=CLR_NAVY, zorder=11)

    # 1. Strong Entity
    ax.add_patch(patches.Rectangle((lx + 2, ly + 13.5), 7.5, 3.0, facecolor=CLR_ENTITY_BG, edgecolor=CLR_TEAL, linewidth=1.4, zorder=11))
    ax.text(lx + 5.75, ly + 15.0, "ENTITY", ha='center', va='center', fontsize=6.2, fontweight='bold', color=CLR_NAVY, zorder=12)
    ax.text(lx + 10.8, ly + 15.0, "Strong Entity", va='center', fontsize=7.2, color=CLR_CARD, zorder=11)

    # 2. Associative Entity
    ax.add_patch(patches.Rectangle((lx + 22, ly + 13.5), 7.5, 3.0, facecolor=CLR_ENTITY_BG, edgecolor=CLR_TEAL, linewidth=1.3, zorder=11))
    ax.add_patch(patches.Rectangle((lx + 22.5, ly + 13.9), 6.5, 2.2, facecolor='none', edgecolor=CLR_TEAL, linewidth=0.9, zorder=12))
    ax.text(lx + 25.75, ly + 15.0, "ASSOC", ha='center', va='center', fontsize=5.8, fontweight='bold', color=CLR_NAVY, zorder=13)
    ax.text(lx + 30.8, ly + 15.0, "Associative Entity", va='center', fontsize=7.2, color=CLR_CARD, zorder=11)

    # 3. Relationship
    pts = [(lx + 5.75, ly + 12.5), (lx + 9.5, ly + 11.0), (lx + 5.75, ly + 9.5), (lx + 2, ly + 11.0)]
    ax.add_patch(Polygon(pts, facecolor=CLR_REL_BG, edgecolor=CLR_TEAL, linewidth=1.3, zorder=11))
    ax.text(lx + 5.75, ly + 11.0, "REL", ha='center', va='center', fontsize=5.8, fontweight='bold', color=CLR_TEAL_DARK, zorder=12)
    ax.text(lx + 10.8, ly + 11.0, "Relationship", va='center', fontsize=7.2, color=CLR_CARD, zorder=11)

    # 4. Total Participation
    ax.plot([lx + 22.5, lx + 29.5], [ly + 11.3, ly + 11.3], color=CLR_LINE, linewidth=1.2, zorder=11)
    ax.plot([lx + 22.5, lx + 29.5], [ly + 10.6, ly + 10.6], color=CLR_LINE, linewidth=1.2, zorder=11)
    ax.text(lx + 30.8, ly + 11.0, "Total (Mandatory)", va='center', fontsize=7.2, color=CLR_CARD, zorder=11)

    # 5. Key Attribute
    ax.add_patch(Ellipse((lx + 5.75, ly + 7.2), 6.5, 2.4, facecolor=CLR_ATTR_BG, edgecolor=CLR_ATTR_BORDER, linewidth=1.0, zorder=11))
    ax.text(lx + 5.75, ly + 7.2, "key_id", ha='center', va='center', fontsize=6.2, fontweight='bold', color=CLR_NAVY, zorder=12)
    ax.plot([lx + 3.8, lx + 7.7], [ly + 6.5, ly + 6.5], color=CLR_NAVY, linewidth=1.1, zorder=12)
    ax.text(lx + 10.8, ly + 7.2, "Primary Key", va='center', fontsize=7.2, color=CLR_CARD, zorder=11)

    # 6. Candidate Key (AK)
    ax.add_patch(Ellipse((lx + 25.75, ly + 7.2), 7.0, 2.4, facecolor=CLR_ATTR_BG, edgecolor=CLR_ATTR_BORDER, linewidth=1.0, zorder=11))
    ax.text(lx + 25.75, ly + 7.2, "code (AK)", ha='center', va='center', fontsize=6.2, color=CLR_NAVY, zorder=12)
    ax.plot([lx + 23.6, lx + 27.9], [ly + 6.5, ly + 6.5], color=CLR_TEAL_DARK, linewidth=0.9, linestyle=':', zorder=12)
    ax.text(lx + 30.8, ly + 7.2, "Candidate Key", va='center', fontsize=7.2, color=CLR_CARD, zorder=11)

    # 7. Multivalued Attribute
    ax.add_patch(Ellipse((lx + 5.75, ly + 3.5), 6.5, 2.5, facecolor=CLR_ATTR_BG, edgecolor=CLR_ATTR_BORDER, linewidth=1.1, zorder=11))
    ax.add_patch(Ellipse((lx + 5.75, ly + 3.5), 5.2, 1.9, facecolor='none', edgecolor=CLR_ATTR_BORDER, linewidth=0.9, zorder=12))
    ax.text(lx + 5.75, ly + 3.5, "roles", ha='center', va='center', fontsize=6.2, color=CLR_NAVY, zorder=13)
    ax.text(lx + 10.8, ly + 3.5, "Multivalued (Array)", va='center', fontsize=7.2, color=CLR_CARD, zorder=11)

    # 8. Derived Attribute
    ax.add_patch(Ellipse((lx + 25.75, ly + 3.5), 7.0, 2.4, facecolor=CLR_ATTR_BG, edgecolor=CLR_TEAL, linewidth=1.2, linestyle='--', zorder=11))
    ax.text(lx + 25.75, ly + 3.5, "available", ha='center', va='center', fontsize=6.2, color=CLR_NAVY, zorder=12)
    ax.text(lx + 30.8, ly + 3.5, "Derived (Computed)", va='center', fontsize=7.2, color=CLR_CARD, zorder=11)

    ax.text(lx + 22, ly + 1.1, "Composite: location -> floor, wing, branch, loc_desc", ha='center', va='center', fontsize=6.5, fontstyle='italic', color=CLR_NOTE, zorder=11)

def generate_slide06_enhanced_diagram():
    """Generates Deliverable A: Advanced Presentation ER Diagram (Slide 6)."""
    fig, ax = plt.subplots(figsize=(18, 10.5), dpi=300)
    ax.set_xlim(0, 180)
    ax.set_ylim(-6, 114)
    ax.axis('off')
    fig.patch.set_facecolor(CLR_CANVAS)

    # Title Header
    ax.text(90, 108, "LabTrack: Conceptual Entity-Relationship Architecture (Chen Notation)",
            ha='center', va='center', fontsize=16, fontweight='bold', color=CLR_NAVY)
    ax.text(90, 104.5, "Comprehensive Academic Model for DCDS ESE Examination | Group A-14 | Department of AI&ML",
            ha='center', va='center', fontsize=9.5, fontstyle='italic', color=CLR_TEAL_DARK)

    # ----------------------------------------------------
    # ENTITY 1: USERS (x=10, y=70, w=18, h=9)
    # ----------------------------------------------------
    draw_entity(ax, 10, 70, 18, 9, "USERS")
    draw_attribute(ax, 8, 86, 4.8, 2.1, "id", attr_type='pk', parent_pos=(13, 79))
    draw_attribute(ax, 20, 86, 6.2, 2.1, "identifier (AK)", attr_type='ak', parent_pos=(19, 79))
    draw_attribute(ax, 32, 84, 5.8, 2.1, "email (AK)", attr_type='ak', parent_pos=(25, 78))
    draw_attribute(ax, 4, 62, 4.5, 2.0, "name", attr_type='simple', parent_pos=(10, 71))
    draw_attribute(ax, 16, 60, 5.2, 2.1, "roles", attr_type='multivalued', parent_pos=(18, 70))

    # ----------------------------------------------------
    # ENTITY 2: PROJECTS (x=60, y=70, w=20, h=9)
    # ----------------------------------------------------
    draw_entity(ax, 60, 70, 20, 9, "PROJECTS")
    draw_attribute(ax, 62, 86, 4.8, 2.1, "id", attr_type='pk', parent_pos=(66, 79))
    draw_attribute(ax, 74, 86, 5.5, 2.1, "name", attr_type='simple', parent_pos=(73, 79))
    draw_attribute(ax, 86, 83, 5.8, 2.1, "created_at", attr_type='simple', parent_pos=(79, 78))

    # Relationship: USERS LEADS PROJECTS (1:N)
    draw_relationship(ax, 44, 76, 5.5, 3.4, "LEADS")
    draw_connector(ax, (28, 74.5), (38.5, 76), is_total=False, label1="1", pos1_adj=(1.5, 1.5))
    draw_connector(ax, (60, 74.5), (49.5, 76), is_total=True, label1="N", pos1_adj=(-3.5, 1.5))

    # Relationship: USERS MENTORS PROJECTS (1:N)
    draw_relationship(ax, 44, 64, 5.5, 3.4, "MENTORS")
    draw_connector(ax, (28, 71), (38.5, 64), is_total=False, label1="1", pos1_adj=(1.5, -2.2))
    draw_connector(ax, (60, 71), (49.5, 64), is_total=True, label1="N", pos1_adj=(-3.5, -2.8))

    # Associative Entity: MEMBERS (resolving PARTICIPATES_IN M:N)
    draw_entity(ax, 36, 46, 18, 8, "MEMBERS", is_associative=True)
    draw_attribute(ax, 34, 36, 6.0, 2.1, "project_id", attr_type='pk', parent_pos=(39, 46))
    draw_attribute(ax, 48, 36, 5.5, 2.1, "user_id", attr_type='pk', parent_pos=(47, 46))
    draw_connector(ax, (21, 70), (38, 54), is_total=False, label2="(1,N)", pos2_adj=(-4.5, 1.5))
    draw_connector(ax, (65, 70), (51, 54), is_total=False, label2="(1,N)", pos2_adj=(2.0, 1.5))

    # ----------------------------------------------------
    # ENTITY 3: REQUESTS (x=114, y=70, w=20, h=9)
    # ----------------------------------------------------
    draw_entity(ax, 114, 70, 20, 9, "REQUESTS")
    draw_attribute(ax, 112, 86, 4.8, 2.1, "id", attr_type='pk', parent_pos=(116, 79))
    draw_attribute(ax, 124, 86, 5.2, 2.1, "state", attr_type='simple', parent_pos=(123, 79))
    draw_attribute(ax, 136, 84, 5.5, 2.1, "purpose", attr_type='simple', parent_pos=(130, 78))
    draw_attribute(ax, 142, 74, 5.8, 2.1, "due_at (opt)", attr_type='optional', parent_pos=(134, 73))
    draw_attribute(ax, 122, 59, 5.8, 2.0, "duration_hrs", attr_type='simple', parent_pos=(122, 70))

    # Relationship: PROJECTS SUBMITS REQUESTS (1:N)
    draw_relationship(ax, 97, 74.5, 5.5, 3.4, "SUBMITS")
    draw_connector(ax, (80, 74.5), (91.5, 74.5), is_total=False, label1="1", pos1_adj=(1.5, 1.5))
    draw_connector(ax, (114, 74.5), (102.5, 74.5), is_total=True, label1="N", pos1_adj=(-3.5, 1.5))

    # ----------------------------------------------------
    # ENTITY 4: INSPECTIONS (x=152, y=46, w=20, h=8)
    # ----------------------------------------------------
    draw_entity(ax, 152, 46, 20, 8, "INSPECTIONS")
    draw_attribute(ax, 154, 60, 4.8, 2.0, "id", attr_type='pk', parent_pos=(158, 54))
    draw_attribute(ax, 166, 60, 5.5, 2.0, "remarks", attr_type='simple', parent_pos=(165, 54))
    draw_attribute(ax, 174, 52, 5.0, 2.0, "details", attr_type='simple', parent_pos=(172, 49))
    draw_attribute(ax, 166, 36, 5.2, 2.0, "actor_id", attr_type='simple', parent_pos=(166, 46))

    # Relationship: REQUESTS HAS INSPECTIONS (1:1, unique request_id constraint)
    draw_relationship(ax, 143, 56, 5.2, 3.0, "INSPECTS")
    draw_connector(ax, (134, 70), (140, 58), is_total=False, label1="(0,1)", pos1_adj=(1.0, -1.0))
    draw_connector(ax, (152, 51), (146, 56), is_total=True, label1="(1,1)", pos1_adj=(-3.5, -1.0))

    # ----------------------------------------------------
    # ENTITY 5: RESERVATIONS (x=68, y=46, w=18, h=8)
    # ----------------------------------------------------
    draw_entity(ax, 68, 46, 18, 8, "RESERVATIONS")
    draw_attribute(ax, 68, 36, 4.8, 2.0, "id", attr_type='pk', parent_pos=(71, 46))
    draw_attribute(ax, 79, 36, 5.2, 2.0, "quantity", attr_type='simple', parent_pos=(78, 46))
    draw_attribute(ax, 88, 43, 5.0, 2.0, "state", attr_type='simple', parent_pos=(86, 48))

    # Relationship: PROJECTS CREATES RESERVATIONS (1:N)
    draw_relationship(ax, 74, 59, 5.0, 2.8, "CREATES")
    draw_connector(ax, (74, 70), (74, 61.8), is_total=False, label1="1", pos1_adj=(1.5, -2.0))
    draw_connector(ax, (74, 54), (74, 56.2), is_total=True, label1="N", pos1_adj=(1.5, 1.0))

    # Relationship: RESERVATIONS TARGETS ITEMS (N:1)
    draw_relationship(ax, 95, 36, 5.2, 3.0, "TARGETS")
    draw_connector(ax, (86, 47), (91, 38.5), is_total=True, label1="N", pos1_adj=(1.0, -1.0))
    draw_connector(ax, (114, 32), (100.2, 36), is_total=False, label1="1", pos1_adj=(-3.0, 1.5))

    # ----------------------------------------------------
    # ENTITY 6: ITEMS (x=114, y=28, w=20, h=9)
    # ----------------------------------------------------
    draw_entity(ax, 114, 28, 20, 9, "ITEMS")
    draw_attribute(ax, 112, 16, 4.8, 2.1, "id", attr_type='pk', parent_pos=(116, 28))
    draw_attribute(ax, 124, 16, 5.2, 2.1, "name", attr_type='simple', parent_pos=(123, 28))
    draw_attribute(ax, 135, 18, 4.8, 2.0, "kind", attr_type='simple', parent_pos=(130, 28))
    draw_attribute(ax, 142, 28, 6.5, 2.2, "alternative_ids", attr_type='multivalued', parent_pos=(134, 31))
    draw_attribute(ax, 142, 38, 6.8, 2.2, "available_units", attr_type='derived', parent_pos=(134, 35))

    # ----------------------------------------------------
    # ENTITY 7: LABS (x=10, y=16, w=20, h=9)
    # ----------------------------------------------------
    draw_entity(ax, 10, 16, 20, 9, "LABS")
    draw_attribute(ax, 8, 32, 4.8, 2.1, "id", attr_type='pk', parent_pos=(12, 25))
    draw_attribute(ax, 21, 32, 6.2, 2.1, "lab_code (opt)", attr_type='optional', parent_pos=(18, 25))

    # Composite Attribute: LOCATION
    loc_cx, loc_cy = 16, 6
    draw_attribute(ax, loc_cx, loc_cy, 6.2, 2.2, "location", attr_type='simple', parent_pos=(18, 16))
    draw_attribute(ax, 28, 8, 4.5, 1.8, "floor", attr_type='simple', parent_pos=(loc_cx+4, loc_cy+1))
    draw_attribute(ax, 32, 3, 4.5, 1.8, "wing", attr_type='simple', parent_pos=(loc_cx+5, loc_cy))
    draw_attribute(ax, 24, -1, 4.8, 1.8, "branch", attr_type='simple', parent_pos=(loc_cx+3, loc_cy-1))
    draw_attribute(ax, 10, -1, 5.8, 1.8, "location_desc", attr_type='simple', parent_pos=(loc_cx-2, loc_cy-1.5))

    # Relationship: USERS GOVERNS LABS (1:N)
    draw_relationship(ax, 10, 46, 5.2, 3.0, "GOVERNS")
    draw_connector(ax, (15, 70), (10, 49), is_total=False, label1="1", pos1_adj=(1.5, -2.0))
    draw_connector(ax, (15, 25), (10, 43), is_total=True, label1="N", pos1_adj=(1.5, 1.5))

    # ----------------------------------------------------
    # RELATIONSHIP: STOCKED_AT (M:N between ITEMS and LABS)
    # ----------------------------------------------------
    stock_cx, stock_cy = 65, 20
    draw_relationship(ax, stock_cx, stock_cy, 6.8, 3.6, "STOCKED_AT")
    draw_connector(ax, (30, 20), (58.2, 20), is_total=False, label1="M", pos1_adj=(1.5, 1.5))
    draw_connector(ax, (114, 29), (71.8, 20), is_total=False, label1="N", pos1_adj=(-3.5, 1.5))
    draw_attribute(ax, 58, 9, 4.8, 1.9, "good", attr_type='simple', parent_pos=(62, 18.2))
    draw_attribute(ax, 72, 9, 4.8, 1.9, "bad", attr_type='simple', parent_pos=(68, 18.2))

    # ----------------------------------------------------
    # TERNARY ASSOCIATION: REQUEST_LINES
    # REQUESTS - ITEMS - LABS (rx=7.0, ry=3.8 at (94, 52))
    # ----------------------------------------------------
    tern_cx, tern_cy = 94, 52
    draw_relationship(ax, tern_cx, tern_cy, 7.2, 3.8, "REQ_LINES\n(Ternary)")
    draw_attribute(ax, 94, 62, 5.5, 2.0, "quantity", attr_type='simple', parent_pos=(tern_cx, tern_cy+3.8))
    draw_connector(ax, (114, 70), (tern_cx + 4.5, tern_cy + 2.5), is_total=True, label1="M", pos1_adj=(-3.0, 1.5))
    draw_connector(ax, (116, 37), (tern_cx + 4, tern_cy - 2.5), is_total=False, label1="N", pos1_adj=(-3.0, -1.5))
    draw_connector(ax, (30, 23), (tern_cx - 5, tern_cy - 2.5), is_total=False, label1="P", pos1_adj=(2.0, 1.5))

    # ----------------------------------------------------
    # ENTITY 8: ASSETS (x=152, y=16, w=20, h=9)
    # ----------------------------------------------------
    draw_entity(ax, 152, 16, 20, 9, "ASSETS")
    draw_attribute(ax, 150, 6, 4.8, 2.1, "id", attr_type='pk', parent_pos=(154, 16))
    draw_attribute(ax, 162, 6, 6.2, 2.1, "barcode (AK)", attr_type='ak', parent_pos=(162, 16))
    draw_attribute(ax, 173, 12, 4.8, 2.0, "state", attr_type='simple', parent_pos=(170, 17))
    draw_attribute(ax, 174, 23, 5.8, 2.0, "bill_number", attr_type='simple', parent_pos=(170, 22))

    # Relationship: ITEMS INSTANTIATES ASSETS (1:N)
    draw_relationship(ax, 142, 22, 5.0, 2.8, "INSTANCE")
    draw_connector(ax, (134, 30), (138, 24), is_total=False, label1="1", pos1_adj=(1.5, 1.5))
    draw_connector(ax, (152, 21), (146, 21.5), is_total=True, label1="N", pos1_adj=(-3.0, 1.5))

    # Relationship: LABS HOUSES ASSETS (1:N)
    draw_relationship(ax, 95, 8, 5.5, 2.8, "HOUSES")
    draw_connector(ax, (30, 17), (89.5, 8), is_total=False, label1="1", pos1_adj=(1.5, -2.0))
    draw_connector(ax, (152, 17), (100.5, 8), is_total=True, label1="N", pos1_adj=(-3.0, -2.0))

    # ----------------------------------------------------
    # NOTATION LEGEND (Cleanly placed at Bottom-Right)
    # ----------------------------------------------------
    build_legend(ax, 134, -4.5)

    svg_path = os.path.join(OUTPUT_DIR, "LabTrack_Chen_Enhanced_Slide06.svg")
    png_path = os.path.join(OUTPUT_DIR, "LabTrack_Chen_Enhanced_Slide06.png")

    plt.savefig(svg_path, bbox_inches='tight', facecolor=CLR_CANVAS)
    plt.savefig(png_path, dpi=300, bbox_inches='tight', facecolor=CLR_CANVAS)
    plt.close()
    print(f"Generated Slide 06 Presentation Diagram:\n  -> {svg_path}\n  -> {png_path}")

def generate_full_academic_diagram():
    """Generates Deliverable B: Complete Academic ER Model across all 20 tables with spacious layout."""
    fig, ax = plt.subplots(figsize=(24, 15.5), dpi=300)
    ax.set_xlim(0, 230)
    ax.set_ylim(-16, 150)
    ax.axis('off')
    fig.patch.set_facecolor(CLR_CANVAS)

    # Main Title Header
    ax.text(115, 145, "LabTrack: Complete Academic Entity-Relationship Architecture (Chen Notation)",
            ha='center', va='center', fontsize=18, fontweight='bold', color=CLR_NAVY)
    ax.text(115, 140.5, "Authoritative Relational Model for Aiven MySQL 8.4 (20 Tables) & Document Projection Boundary | DCDSL ESE Viva Submission",
            ha='center', va='center', fontsize=10.5, fontstyle='italic', color=CLR_TEAL_DARK)

    # ----------------------------------------------------
    # DOMAIN 1: IDENTITY, RBAC & SESSIONS
    # ----------------------------------------------------
    # USERS
    draw_entity(ax, 12, 90, 18, 9, "USERS")
    draw_attribute(ax, 10, 106, 5.0, 2.1, "id", attr_type='pk', parent_pos=(15, 99))
    draw_attribute(ax, 22, 106, 6.2, 2.1, "identifier (AK)", attr_type='ak', parent_pos=(21, 99))
    draw_attribute(ax, 34, 104, 5.8, 2.1, "email (AK)", attr_type='ak', parent_pos=(27, 97))
    draw_attribute(ax, 6, 80, 4.5, 2.0, "name", attr_type='simple', parent_pos=(12, 91))
    draw_attribute(ax, 17, 78, 5.5, 2.1, "roles", attr_type='multivalued', parent_pos=(20, 90))

    # AUTH_SESSIONS (Shifted higher to give room to AUTHENTICATES)
    draw_entity(ax, 12, 122, 18, 8, "AUTH_SESSIONS")
    draw_attribute(ax, 22, 134, 6.8, 2.2, "token_hash", attr_type='pk', parent_pos=(22, 130))
    draw_attribute(ax, 36, 130, 5.8, 2.1, "expires_at", attr_type='simple', parent_pos=(30, 126))

    # USERS AUTHENTICATES AUTH_SESSIONS (1:N)
    draw_relationship(ax, 21, 114, 5.2, 3.0, "AUTHENTICATES")
    draw_connector(ax, (21, 99), (21, 111), is_total=False, label1="1", pos1_adj=(1.5, 0.5))
    draw_connector(ax, (21, 122), (21, 117), is_total=True, label1="N", pos1_adj=(1.5, -0.5))

    # ----------------------------------------------------
    # DOMAIN 2: RESEARCH PROJECTS & MEMBERSHIP
    # ----------------------------------------------------
    # PROJECTS
    draw_entity(ax, 66, 90, 20, 9, "PROJECTS")
    draw_attribute(ax, 68, 106, 5.0, 2.1, "id", attr_type='pk', parent_pos=(72, 99))
    draw_attribute(ax, 80, 106, 5.5, 2.1, "name", attr_type='simple', parent_pos=(79, 99))
    draw_attribute(ax, 92, 102, 5.8, 2.1, "created_at", attr_type='simple', parent_pos=(85, 97))

    # USERS LEADS PROJECTS (1:N)
    draw_relationship(ax, 48, 96, 5.5, 3.4, "LEADS")
    draw_connector(ax, (30, 94.5), (42.5, 96), is_total=False, label1="1", pos1_adj=(1.5, 1.5))
    draw_connector(ax, (66, 94.5), (53.5, 96), is_total=True, label1="N", pos1_adj=(-3.5, 1.5))

    # USERS MENTORS PROJECTS (1:N)
    draw_relationship(ax, 48, 84, 5.5, 3.4, "MENTORS")
    draw_connector(ax, (30, 91), (42.5, 84), is_total=False, label1="1", pos1_adj=(1.5, -2.0))
    draw_connector(ax, (66, 91), (53.5, 84), is_total=True, label1="N", pos1_adj=(-3.5, -2.0))

    # MEMBERS (Associative Entity for M:N)
    draw_entity(ax, 40, 66, 18, 8, "MEMBERS", is_associative=True)
    draw_attribute(ax, 32, 57, 6.0, 2.1, "project_id", attr_type='pk', parent_pos=(42, 66))
    draw_attribute(ax, 46, 57, 5.5, 2.1, "user_id", attr_type='pk', parent_pos=(50, 66))
    draw_connector(ax, (23, 90), (41, 74), is_total=False, label2="(1,N)", pos2_adj=(-4.5, 1.5))
    draw_connector(ax, (71, 90), (56, 74), is_total=False, label2="(1,N)", pos2_adj=(2.0, 1.5))

    # ----------------------------------------------------
    # DOMAIN 3: REQUISITIONS, APPROVALS & EXTENSIONS
    # ----------------------------------------------------
    # REQUESTS
    draw_entity(ax, 122, 90, 20, 9, "REQUESTS")
    draw_attribute(ax, 118, 106, 5.0, 2.1, "id", attr_type='pk', parent_pos=(122, 99))
    draw_attribute(ax, 130, 106, 5.5, 2.1, "state", attr_type='simple', parent_pos=(129, 99))
    draw_attribute(ax, 142, 104, 5.5, 2.1, "purpose", attr_type='simple', parent_pos=(136, 98))
    draw_attribute(ax, 148, 95, 6.2, 2.1, "due_at (opt)", attr_type='optional', parent_pos=(142, 94))
    draw_attribute(ax, 145, 85, 6.0, 2.0, "duration_hrs", attr_type='simple', parent_pos=(142, 90))

    # PROJECTS SUBMITS REQUESTS (1:N)
    draw_relationship(ax, 104, 94.5, 5.5, 3.4, "SUBMITS")
    draw_connector(ax, (86, 94.5), (98.5, 94.5), is_total=False, label1="1", pos1_adj=(1.5, 1.5))
    draw_connector(ax, (122, 94.5), (109.5, 94.5), is_total=True, label1="N", pos1_adj=(-3.5, 1.5))

    # EXTENSIONS
    draw_entity(ax, 164, 88, 18, 8, "EXTENSIONS")
    draw_attribute(ax, 166, 100, 5.0, 2.0, "id", attr_type='pk', parent_pos=(169, 96))
    draw_attribute(ax, 178, 100, 5.8, 2.0, "new_due_at", attr_type='simple', parent_pos=(176, 96))
    draw_attribute(ax, 188, 94, 5.5, 2.0, "reason", attr_type='simple', parent_pos=(182, 92))

    # REQUESTS HAS EXTENSIONS (1:N)
    draw_relationship(ax, 151, 92, 5.0, 2.8, "EXTENDS")
    draw_connector(ax, (142, 92), (146, 92), is_total=False, label1="1", pos1_adj=(1.0, 1.5))
    draw_connector(ax, (164, 92), (156, 92), is_total=True, label1="N", pos1_adj=(-3.0, 1.5))

    # ----------------------------------------------------
    # DOMAIN 4: INSPECTIONS, INCIDENTS & FORENSIC EVIDENCE
    # ----------------------------------------------------
    # INSPECTIONS (1:1 with REQUESTS)
    draw_entity(ax, 164, 68, 18, 8, "INSPECTIONS")
    draw_attribute(ax, 166, 80, 4.8, 2.0, "id", attr_type='pk', parent_pos=(170, 76))
    draw_attribute(ax, 178, 80, 5.5, 2.0, "remarks", attr_type='simple', parent_pos=(176, 76))
    draw_attribute(ax, 188, 74, 5.0, 2.0, "details", attr_type='simple', parent_pos=(182, 71))
    draw_attribute(ax, 188, 64, 5.2, 2.0, "actor_id", attr_type='simple', parent_pos=(182, 69))

    # REQUESTS HAS INSPECTIONS (1:1, UNIQUE request_id)
    draw_relationship(ax, 151, 76, 5.2, 3.0, "INSPECTS")
    draw_connector(ax, (140, 90), (146, 79), is_total=False, label1="(0,1)", pos1_adj=(1.0, -1.0))
    draw_connector(ax, (164, 72), (156, 76), is_total=True, label1="(1,1)", pos1_adj=(-3.5, -1.0))

    # INCIDENTS (Escalation on Failed Inspection)
    draw_entity(ax, 164, 46, 18, 8, "INCIDENTS")
    draw_attribute(ax, 166, 36, 4.8, 1.9, "id", attr_type='pk', parent_pos=(170, 46))
    draw_attribute(ax, 178, 36, 5.8, 1.9, "attribution", attr_type='simple', parent_pos=(176, 46))

    # EVIDENCE (Forensic SHA-256 Storage)
    draw_entity(ax, 198, 46, 18, 8, "EVIDENCE")
    draw_attribute(ax, 202, 36, 5.5, 1.9, "id (SHA)", attr_type='pk', parent_pos=(206, 46))
    draw_attribute(ax, 214, 42, 5.5, 1.9, "storage_key", attr_type='simple', parent_pos=(212, 47))

    # Relationships: REQUESTS LOGS_FAIL INCIDENTS & INCIDENTS ATTACHES EVIDENCE
    draw_relationship(ax, 150, 52, 5.2, 3.0, "LOGS_FAIL")
    draw_connector(ax, (136, 90), (146, 55), is_total=False, label1="1", pos1_adj=(1.5, -1.0))
    draw_connector(ax, (164, 50), (155.2, 52), is_total=True, label1="N", pos1_adj=(-3.0, -1.0))
    draw_relationship(ax, 189, 50, 4.8, 2.6, "ATTACHES")
    draw_connector(ax, (182, 50), (184.2, 50), is_total=False, label1="1", pos1_adj=(0.5, 1.5))
    draw_connector(ax, (198, 50), (193.8, 50), is_total=True, label1="N", pos1_adj=(-2.5, 1.5))

    # ----------------------------------------------------
    # DOMAIN 5: RESERVATIONS (FIFO Queue)
    # ----------------------------------------------------
    draw_entity(ax, 66, 66, 18, 8, "RESERVATIONS")
    draw_attribute(ax, 66, 56, 4.8, 1.9, "id", attr_type='pk', parent_pos=(69, 66))
    draw_attribute(ax, 77, 56, 5.2, 1.9, "quantity", attr_type='simple', parent_pos=(75, 66))

    # PROJECTS CREATES RESERVATIONS (1:N)
    draw_relationship(ax, 75, 79, 4.8, 2.8, "CREATES")
    draw_connector(ax, (75, 90), (75, 81.8), is_total=False, label1="1", pos1_adj=(1.5, -2.0))
    draw_connector(ax, (75, 74), (75, 76.2), is_total=True, label1="N", pos1_adj=(1.5, 1.0))

    # ----------------------------------------------------
    # DOMAIN 6: ITEMS, LABS & SERIALIZED ASSETS
    # ----------------------------------------------------
    # ITEMS
    draw_entity(ax, 122, 32, 20, 9, "ITEMS")
    draw_attribute(ax, 120, 20, 5.0, 2.1, "id", attr_type='pk', parent_pos=(124, 32))
    draw_attribute(ax, 132, 20, 5.5, 2.1, "name", attr_type='simple', parent_pos=(131, 32))
    draw_attribute(ax, 144, 22, 5.0, 2.0, "kind", attr_type='simple', parent_pos=(138, 32))
    draw_attribute(ax, 148, 32, 6.8, 2.2, "alternative_ids", attr_type='multivalued', parent_pos=(142, 35))
    draw_attribute(ax, 148, 42, 7.0, 2.2, "available_units", attr_type='derived', parent_pos=(142, 39))

    # RESERVATIONS TARGETS ITEMS (N:1)
    draw_relationship(ax, 98, 44, 5.2, 3.0, "TARGETS")
    draw_connector(ax, (84, 66), (93.5, 46.5), is_total=True, label1="N", pos1_adj=(1.0, -1.0))
    draw_connector(ax, (122, 38), (103.2, 44), is_total=False, label1="1", pos1_adj=(-3.0, 1.5))

    # LABS
    draw_entity(ax, 12, 22, 20, 9, "LABS")
    draw_attribute(ax, 10, 38, 5.0, 2.1, "id", attr_type='pk', parent_pos=(14, 31))
    draw_attribute(ax, 23, 38, 6.2, 2.1, "lab_code (opt)", attr_type='optional', parent_pos=(20, 31))

    # Composite Attribute: LOCATION
    loc_cx, loc_cy = 18, 10
    draw_attribute(ax, loc_cx, loc_cy, 6.8, 2.3, "location", attr_type='simple', parent_pos=(20, 22))
    draw_attribute(ax, 31, 12, 4.5, 1.8, "floor", attr_type='simple', parent_pos=(loc_cx+4, loc_cy+1))
    draw_attribute(ax, 35, 6, 4.5, 1.8, "wing", attr_type='simple', parent_pos=(loc_cx+5, loc_cy))
    draw_attribute(ax, 28, 1, 4.8, 1.8, "branch", attr_type='simple', parent_pos=(loc_cx+3, loc_cy-1))
    draw_attribute(ax, 12, 1, 6.0, 1.8, "location_desc", attr_type='simple', parent_pos=(loc_cx-2, loc_cy-1.5))

    # USERS GOVERNS LABS (1:N)
    draw_relationship(ax, 21, 56, 5.5, 3.2, "GOVERNS")
    draw_connector(ax, (21, 90), (21, 59.2), is_total=False, label1="1", pos1_adj=(1.5, -2.0))
    draw_connector(ax, (21, 31), (21, 52.8), is_total=True, label1="N", pos1_adj=(1.5, 1.5))

    # STOCKED_AT (M:N between ITEMS and LABS)
    stock_cx, stock_cy = 70, 24
    draw_relationship(ax, stock_cx, stock_cy, 7.2, 3.8, "STOCKED_AT")
    draw_connector(ax, (32, 24), (62.8, 24), is_total=False, label1="M", pos1_adj=(1.5, 1.5))
    draw_connector(ax, (122, 34), (77.2, 24), is_total=False, label1="N", pos1_adj=(-3.5, 1.5))
    draw_attribute(ax, 63, 14, 4.8, 1.9, "good", attr_type='simple', parent_pos=(67, 20.2))
    draw_attribute(ax, 77, 14, 4.8, 1.9, "bad", attr_type='simple', parent_pos=(73, 20.2))

    # TERNARY: REQUISITION_LINES (REQUESTS, ITEMS, LABS)
    tern_cx, tern_cy = 98, 58
    draw_relationship(ax, tern_cx, tern_cy, 7.8, 4.0, "REQ_LINES\n(Ternary)")
    draw_attribute(ax, 98, 69, 5.5, 2.0, "quantity", attr_type='simple', parent_pos=(tern_cx, tern_cy+4.0))
    draw_connector(ax, (122, 90), (tern_cx + 5, tern_cy + 2.8), is_total=True, label1="M", pos1_adj=(-3.0, 1.5))
    draw_connector(ax, (124, 41), (tern_cx + 4, tern_cy - 2.8), is_total=False, label1="N", pos1_adj=(-3.0, -1.5))
    draw_connector(ax, (32, 28), (tern_cx - 5, tern_cy - 2.8), is_total=False, label1="P", pos1_adj=(2.0, 1.5))

    # ASSETS
    draw_entity(ax, 168, 18, 20, 9, "ASSETS")
    draw_attribute(ax, 166, 6, 5.0, 2.1, "id", attr_type='pk', parent_pos=(170, 18))
    draw_attribute(ax, 178, 6, 6.2, 2.1, "barcode (AK)", attr_type='ak', parent_pos=(178, 18))
    draw_attribute(ax, 190, 12, 5.0, 2.0, "state", attr_type='simple', parent_pos=(186, 19))
    draw_attribute(ax, 190, 25, 6.0, 2.0, "bill_number", attr_type='simple', parent_pos=(186, 24))

    # ITEMS INSTANTIATES ASSETS (1:N)
    draw_relationship(ax, 152, 24, 5.5, 3.0, "INSTANCE")
    draw_connector(ax, (142, 33), (146.5, 25), is_total=False, label1="1", pos1_adj=(1.5, 1.5))
    draw_connector(ax, (168, 23), (157.5, 24), is_total=True, label1="N", pos1_adj=(-3.0, 1.5))

    # LABS HOUSES ASSETS (1:N)
    draw_relationship(ax, 102, 10, 5.8, 3.0, "HOUSES")
    draw_connector(ax, (32, 22), (96.2, 10), is_total=False, label1="1", pos1_adj=(1.5, -2.0))
    draw_connector(ax, (168, 19), (107.8, 10), is_total=True, label1="N", pos1_adj=(-3.0, -2.0))

    # ----------------------------------------------------
    # DOMAIN 7: AUDITING & ASYNCHRONOUS EVENT DISPATCH
    # ----------------------------------------------------
    # AUDIT (Append-Only Relational Ledger)
    draw_entity(ax, 66, 118, 18, 8, "AUDIT")
    draw_attribute(ax, 66, 131, 5.0, 2.0, "id", attr_type='pk', parent_pos=(70, 126))
    draw_attribute(ax, 78, 131, 5.2, 2.0, "action", attr_type='simple', parent_pos=(77, 126))
    draw_attribute(ax, 89, 126, 5.8, 2.0, "prev_state", attr_type='simple', parent_pos=(84, 122))

    # REQUESTS LOGS AUDIT (1:N)
    draw_relationship(ax, 100, 118, 5.2, 3.0, "LOGS")
    draw_connector(ax, (126, 99), (103, 116), is_total=False, label1="1", pos1_adj=(1.5, -1.0))
    draw_connector(ax, (84, 122), (94.8, 118), is_total=True, label1="N", pos1_adj=(-3.0, 1.5))

    # OUTBOX (Transactional Outbox Pattern)
    draw_entity(ax, 124, 118, 18, 8, "OUTBOX")
    draw_attribute(ax, 132, 131, 6.0, 2.0, "event_key (AK)", attr_type='ak', parent_pos=(133, 126))
    draw_attribute(ax, 146, 126, 5.2, 2.0, "payload", attr_type='simple', parent_pos=(142, 123))

    # Conceptual Async Outbox Link (NO FOREIGN KEY - Application Event Hook)
    draw_connector(ax, (133, 99), (133, 118), is_dashed=True, label1="Async Event (Worker)", pos1_adj=(1.5, 9.0))

    # ----------------------------------------------------
    # INSET 1: CONCEPTUAL ISA SPECIALIZATION (ITEMS)
    # Positioned at (168, 110) with generous clearance above EXTENSIONS
    # ----------------------------------------------------
    ax.add_patch(FancyBboxPatch((166, 112), 56, 26, boxstyle="round,pad=0.6", facecolor='#F8FAFC', edgecolor='#94A3B8', linewidth=1.2, zorder=8))
    ax.text(194, 134.5, "CONCEPTUAL ISA SPECIALIZATION (ITEMS)", ha='center', va='center', fontsize=8.2, fontweight='bold', color=CLR_NAVY, zorder=9)
    # Superclass ITEM
    ax.add_patch(patches.Rectangle((185, 125), 18, 5.0, facecolor=CLR_ENTITY_BG, edgecolor=CLR_TEAL, linewidth=1.3, zorder=9))
    ax.text(194, 127.5, "ITEMS (Superclass)", ha='center', va='center', fontsize=7.2, fontweight='bold', color=CLR_NAVY, zorder=10)
    # ISA Triangle
    pts_isa = [(194, 121.5), (190, 117.5), (198, 117.5)]
    ax.add_patch(Polygon(pts_isa, facecolor='#FEF3C7', edgecolor='#D97706', linewidth=1.1, zorder=9))
    ax.text(194, 119.0, "ISA", ha='center', va='center', fontsize=6.8, fontweight='bold', color='#92400E', zorder=10)
    ax.plot([194, 194], [125, 121.5], color=CLR_LINE, linewidth=1.1, zorder=9)
    # Subclasses
    ax.add_patch(patches.Rectangle((170, 114), 21, 3.8, facecolor=CLR_ENTITY_BG, edgecolor=CLR_TEAL, linewidth=1.1, zorder=9))
    ax.text(180.5, 115.9, "ASSET_ITEM (Serialized)", ha='center', va='center', fontsize=6.8, color=CLR_NAVY, zorder=10)
    ax.add_patch(patches.Rectangle((197, 114), 21, 3.8, facecolor=CLR_ENTITY_BG, edgecolor=CLR_TEAL, linewidth=1.1, zorder=9))
    ax.text(207.5, 115.9, "CONSUMABLE (Bulk)", ha='center', va='center', fontsize=6.8, color=CLR_NAVY, zorder=10)
    ax.plot([191, 180.5], [117.5, 117.8], color=CLR_LINE, linewidth=1.1, zorder=9)
    ax.plot([197, 207.5], [117.5, 117.8], color=CLR_LINE, linewidth=1.1, zorder=9)
    ax.text(194, 110.5, "Physical Mapping: Disjoint specialization implemented via discriminator\ncolumn kind IN ('ASSET','CONSUMABLE') on single authoritative MySQL table.",
            ha='center', va='center', fontsize=6.0, fontstyle='italic', color=CLR_NOTE, zorder=9)

    # ----------------------------------------------------
    # NOTATION LEGEND (Cleanly placed at Bottom-Center)
    # ----------------------------------------------------
    build_legend(ax, 78, -13.5)

    svg_path = os.path.join(OUTPUT_DIR, "LabTrack_Chen_Full_Academic_Model.svg")
    png_path = os.path.join(OUTPUT_DIR, "LabTrack_Chen_Full_Academic_Model.png")

    plt.savefig(svg_path, bbox_inches='tight', facecolor=CLR_CANVAS)
    plt.savefig(png_path, dpi=300, bbox_inches='tight', facecolor=CLR_CANVAS)
    plt.close()
    print(f"Generated Full Academic ER Diagram:\n  -> {svg_path}\n  -> {png_path}")

if __name__ == "__main__":
    generate_slide06_enhanced_diagram()
    generate_full_academic_diagram()
