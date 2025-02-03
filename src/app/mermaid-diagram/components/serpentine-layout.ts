import * as go from 'gojs';

export class SerpentineLayout extends go.Layout {
  private _spacing: go.Size = new go.Size(50, 50);
  private _wrapCount: number = 3; // 🔥 Mantém 4 nós por linha
  private _root: go.Node | null = null;

  constructor(init?: Partial<SerpentineLayout>) {
    super();
    this.isViewportSized = true; // O layout se ajusta ao tamanho da tela
    if (init) Object.assign(this, init);
  }

  get spacing(): go.Size {
    return this._spacing;
  }
  set spacing(val: go.Size) {
    if (!this._spacing.equals(val)) {
      this._spacing = val;
      this.invalidateLayout();
    }
  }

  get wrapCount(): number {
    return this._wrapCount;
  }
  set wrapCount(val: number) {
    if (this._wrapCount !== val) {
      this._wrapCount = val;
      this.invalidateLayout();
    }
  }

  override doLayout(collection: go.Diagram | go.Group): void {
    const diagram = this.diagram;
    if (!diagram) return;

    const coll = this.collectParts(collection);
    let root: go.Node | null = this._root;

    if (!root) {
      for (const part of coll.iterator) {
        if (part instanceof go.Node && part.findLinksInto().count === 0) {
          root = part;
          break;
        }
      }
    }

    if (!root) return;

    const spacing = this.spacing;
    diagram.startTransaction('Serpentine Layout');

    this.arrangementOrigin = this.initialOrigin(this.arrangementOrigin);
    let x = this.arrangementOrigin.x;
    let y = this.arrangementOrigin.y;
    let rowHeight = 0;
    let increasing = true;
    let node: go.Node | null = root;
    let count = 0;
    let rowNodes: go.Node[] = [];

    while (node !== null) {
      rowNodes.push(node);
      const orignode: go.Node = node;
      if (node.containingGroup !== null) node = node.containingGroup;
      const bounds = this.getLayoutBounds(node);

      let nextlink: go.Link | null = null;
      for (const link of orignode.findLinksOutOf()) {
        if (coll.has(link)) {
          nextlink = link;
          break;
        }
      }

      let nextnode: go.Node | null = nextlink ? nextlink.toNode : null;
      if (nextnode !== null && nextnode.containingGroup !== null) {
        nextnode = nextnode.containingGroup;
      }
      const nextBounds = nextnode ? this.getLayoutBounds(nextnode) : new go.Rect();

      if (increasing) {
        node.move(new go.Point(x, y));
        x += bounds.width;
        rowHeight = Math.max(rowHeight, bounds.height);
        count++;

        if (count >= this._wrapCount) { // 🔥 Quebra a linha após 4 nós
          // 🔥 Alinha os nós ao centro da linha antes de mudar para a próxima
          const rowCenterY = y + rowHeight / 2;
          for (const n of rowNodes) {
            const nb = this.getLayoutBounds(n);
            n.move(new go.Point(n.location.x, rowCenterY - nb.height / 2));
          }
          rowNodes = []; // Reseta a linha

          y += rowHeight + spacing.height;
          count = 0;
          increasing = false;
          x -= spacing.width;
          if (nextlink) {
            nextlink.fromSpot = go.Spot.Right;
            nextlink.toSpot = go.Spot.Right; // 🔥 Mantém a conexão correta
          }
        } else {
          x += spacing.width;
          if (nextlink) {
            nextlink.fromSpot = go.Spot.Right;
            nextlink.toSpot = go.Spot.Left;
          }
        }
      } else {
        x -= bounds.width;
        node.move(new go.Point(x, y));
        rowHeight = Math.max(rowHeight, bounds.height);
        count++;

        if (count >= this._wrapCount) { // 🔥 Quebra a linha após 4 nós
          // 🔥 Alinha os nós ao centro da linha antes de mudar para a próxima
          const rowCenterY = y + rowHeight / 2;
          for (const n of rowNodes) {
            const nb = this.getLayoutBounds(n);
            n.move(new go.Point(n.location.x, rowCenterY - nb.height / 2));
          }
          rowNodes = []; // Reseta a linha

          y += rowHeight + spacing.height;
          count = 0;
          increasing = true;
          x += spacing.width;
          if (nextlink) {
            nextlink.fromSpot = go.Spot.Left;
            nextlink.toSpot = go.Spot.Left; // 🔥 Mantém a conexão correta
          }
        } else {
          x -= spacing.width;
          if (nextlink) {
            nextlink.fromSpot = go.Spot.Left;
            nextlink.toSpot = go.Spot.Right;
          }
        }
      }

      node = nextnode;
    }

    // 🔥 Alinha a última linha antes de finalizar
    if (rowNodes.length > 0) {
      const rowCenterY = y + rowHeight / 2;
      for (const n of rowNodes) {
        const nb = this.getLayoutBounds(n);
        n.move(new go.Point(n.location.x, rowCenterY - nb.height / 2));
      }
    }

    diagram.commitTransaction('Serpentine Layout');
  }
}
