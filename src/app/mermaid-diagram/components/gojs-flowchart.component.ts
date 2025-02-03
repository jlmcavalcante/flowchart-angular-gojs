import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as go from 'gojs';
import { SerpentineLayout } from './serpentine-layout';
import { MARCOS_PROCESSO } from '../data/marcos-processo.data';

@Component({
  selector: 'app-gojs-flowchart',
  standalone: true,
  templateUrl: './gojs-flowchart.component.html',
  styleUrl: './gojs-flowchart.component.scss',
})
export class GojsFlowchartComponent implements AfterViewInit {
  @ViewChild('diagramDiv', { static: true }) private diagramRef!: ElementRef;

  ngAfterViewInit() {
    const $ = go.GraphObject.make;

    const myDiagram = $(go.Diagram, this.diagramRef.nativeElement, {
      isTreePathToChildren: false,
      layout: new SerpentineLayout({
        wrapCount: 3,
        spacing: new go.Size(120, 90),
      }),
      isReadOnly: true,
    });

    function definirCores(tipo: string): { border: string; background: string } {
      const cores: { [key: string]: { border: string; background: string } } = {
        decisão: { border: "#FFDAD5", background: "#FFDAD5" },
        ato_polo_ativo: { border: "#D6EAF8", background: "#D6EAF8" },
        ato_polo_passivo: { border: "#D5F5E3", background: "#D5F5E3" },
        ato_tribunal: { border: "#FCF3CF", background: "#FCF3CF" },
      };
      return cores[tipo] || { border: "#333", background: "#F4F4F4" };
    }

    myDiagram.nodeTemplate = $(
      go.Node,
      'Auto',
      { movable: false, selectable: false },
      $(
        go.Shape,
        'RoundedRectangle',
        {
          strokeWidth: 2,
          width: 300,
          minSize: new go.Size(300, NaN),
          margin: new go.Margin(0, 5, 0, 5),
        },
        new go.Binding('stroke', 'tipo_ato', (tipo) => definirCores(tipo).border),
        new go.Binding('fill', 'tipo_ato', (tipo) => definirCores(tipo).background)
      ),

      $(go.Panel, 'Vertical', { padding: 12, alignment: go.Spot.Center, defaultAlignment: go.Spot.Left },

        $(go.Panel, "Auto",
          { stretch: go.GraphObject.Fill },
          $(go.Shape, "RoundedRectangle", { fill: "#FFFFFF", stroke: "transparent", parameter1: 10 }),
          $(go.TextBlock,
            {
              font: 'bold 14px sans-serif',
              textAlign: 'center',
              stroke: 'black',
              wrap: go.Wrap.Fit,
              margin: new go.Margin(8, 0, 8, 0),
              maxSize: new go.Size(280, NaN),
            },
            new go.Binding('text', 'title')
          )
        ),

        $(go.Panel, "Horizontal", { defaultAlignment: go.Spot.Left, margin: new go.Margin(20, 0, 0, 0) },
          $(go.TextBlock, { font: 'bold 12px sans-serif', stroke: '#000', margin: new go.Margin(0, 4, 0, 0), text: "Data:" }),
          $(go.TextBlock, { font: '12px sans-serif', stroke: '#000', width: 220, wrap: go.TextBlock.WrapFit }, new go.Binding('text', 'data'))
        ),

        $(go.Panel, "Horizontal", { defaultAlignment: go.Spot.Left, margin: new go.Margin(10, 0, 0, 0) },
          $(go.TextBlock, { font: 'bold 12px sans-serif', stroke: '#000', margin: new go.Margin(0, 4, 0, 0), text: "Tipo:" }),
          $(go.TextBlock, { font: '12px sans-serif', stroke: '#000', width: 320, wrap: go.TextBlock.WrapFit }, new go.Binding('text', 'type'))
        ),

        $(go.Panel, "Horizontal", { defaultAlignment: go.Spot.Left, margin: new go.Margin(10, 0, 0, 0) },
          $(go.TextBlock, { font: 'bold 12px sans-serif', stroke: '#000', margin: new go.Margin(0, 4, 0, 0), text: "Unidade:" }),
          $(go.TextBlock, { font: '12px sans-serif', stroke: '#000', width: 220, wrap: go.TextBlock.WrapFit }, new go.Binding('text', 'unidade'))
        ),

        $(go.Panel, "Horizontal", { defaultAlignment: go.Spot.Left, margin: new go.Margin(10, 0, 0, 0) },
          $(go.TextBlock, { font: 'bold 12px sans-serif', stroke: '#000', margin: new go.Margin(0, 4, 0, 0), text: "Instância:" }),
          $(go.TextBlock, { font: '12px sans-serif', stroke: '#000', width: 300, wrap: go.TextBlock.WrapFit }, new go.Binding('text', 'instance'))
        ),

        $(go.Shape, "LineH", { stroke: "#FFF", strokeWidth: 2, width: 260, margin: new go.Margin(-10, 0, -10, 0) }),

        $(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left, margin: new go.Margin(4, 0, 0, 0) },
          $(go.TextBlock, { font: 'bold 12px sans-serif', stroke: '#000', margin: new go.Margin(0, 0, 5, 0), text: "Descrição 📝:" }),
          $(go.TextBlock, { font: '12px sans-serif', stroke: '#000', width: 260, wrap: go.TextBlock.WrapFit, margin: new go.Margin(0, 0, 5, 0), spacingAbove: 3 }, new go.Binding('text', 'descricao'))
        )
      )
    );

    myDiagram.linkTemplate = $(
      go.Link,
      { routing: go.Routing.AvoidsNodes, corner: 50, toShortLength: 16 },
      $(go.Shape, { stroke: '#000000', strokeWidth: 16, strokeJoin: "miter" }),
      $(go.Shape, {
        toArrow: 'Standard',
        stroke: "#000000",
        fill: "#000000",
        strokeWidth: 10,
        scale: 1,
      })
    );

    const model = new go.TreeModel();
    model.nodeParentKeyProperty = 'next';
    model.nodeDataArray = MARCOS_PROCESSO;
    myDiagram.model = model;
  }
}
