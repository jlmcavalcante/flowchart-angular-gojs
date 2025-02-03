import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as go from 'gojs';
import { SerpentineLayout } from './serpentine-layout';
import { MARCOS_PROCESSO } from '../data/marcos-processo.data';

@Component({
  selector: 'app-mermaid-diagram',
  standalone: true,
  templateUrl: './mermaid-diagram.component.html',
  styleUrl: './mermaid-diagram.component.scss',
})
export class MermaidDiagramComponent implements AfterViewInit {
  @ViewChild('diagramDiv', { static: true }) private diagramRef!: ElementRef;

  ngAfterViewInit() {
    const $ = go.GraphObject.make;

    const myDiagram = $(go.Diagram, this.diagramRef.nativeElement, {
      isTreePathToChildren: false,
      layout: new SerpentineLayout({
        wrapCount: 3,
        spacing: new go.Size(50, 50),
      }),
      isReadOnly: true, // 🔥 Nós fixos
    });

    // 🔥 Template dos Nós 🔥
    myDiagram.nodeTemplate = $(
      go.Node,
      'Auto',
      { movable: false, selectable: false }, // 🔥 Impede movimentação dos nós
      $(
        go.Shape,
        'RoundedRectangle',
        { fill: 'white', strokeWidth: 2, width: 280 }, // 🔹 Largura fixa, altura dinâmica
        new go.Binding('fill', 'color')
      ),
      $(
        go.Panel,
        'Vertical',
        { padding: 10, alignment: go.Spot.Left, defaultAlignment: go.Spot.Left }, // 🔹 Alinha tudo à esquerda

        // 🔹 Título (Negrito e Maior)
        $(
          go.TextBlock,
          {
            font: 'bold 14px sans-serif',
            textAlign: 'left',
            stroke: '#000',
            width: 260,
            wrap: go.TextBlock.WrapFit,
          },
          new go.Binding('text', 'title', (t) => `Título: ${t}`)
        ),

        // 🔹 Data (Itálico e menor)
        $(
          go.TextBlock,
          {
            font: 'italic 12px sans-serif',
            textAlign: 'left',
            stroke: '#444',
            margin: new go.Margin(5, 0, 5, 0), // 🔹 Espaço extra para separar os itens
            width: 260,
            wrap: go.TextBlock.WrapFit,
          },
          new go.Binding('text', 'data', (d) => `Data: ${d}`)
        ),

        // 🔹 Tipo
        $(
          go.TextBlock,
          {
            font: '12px sans-serif',
            textAlign: 'left',
            stroke: '#444',
            width: 260,
            wrap: go.TextBlock.WrapFit,
          },
          new go.Binding('text', 'type', (t) => `Tipo: ${t}`)
        ),

        // 🔹 Unidade
        $(
          go.TextBlock,
          {
            font: '12px sans-serif',
            textAlign: 'left',
            stroke: '#555',
            width: 260,
            wrap: go.TextBlock.WrapFit,
          },
          new go.Binding('text', 'unidade', (u) => `Unidade: ${u}`)
        ),

        // 🔹 Instância (Com espaçamento extra antes dele)
        $(
          go.TextBlock,
          {
            font: '12px sans-serif',
            textAlign: 'left',
            stroke: '#666',
            margin: new go.Margin(5, 0, 5, 0), // 🔹 Espaço extra antes da instância
            width: 260,
            wrap: go.TextBlock.WrapFit,
          },
          new go.Binding('text', 'instance', (i) => `Instância: ${i}`)
        ),

        // 🔹 Descrição (Cor mais suave)
        $(
          go.TextBlock,
          {
            font: '12px sans-serif',
            textAlign: 'left',
            stroke: '#777',
            width: 260,
            wrap: go.TextBlock.WrapFit,
          },
          new go.Binding('text', 'descricao', (d) => `Descrição: ${d}`)
        )
      )
    );

    // 🔥 Template das Setas 🔥
    myDiagram.linkTemplate = $(
      go.Link,
      { routing: go.Routing.Orthogonal, corner: 10 },
      $(go.Shape, { stroke: 'black', strokeWidth: 4, strokeJoin: "miter" }),
      $(go.Shape, {
        toArrow: 'Standard',
        stroke: 'black',
        fill: 'black',
        strokeWidth: 4,
        scale: 1,
      })
    );

    // 🔥 Modelo do Fluxograma 🔥
    const model = new go.TreeModel();
    model.nodeParentKeyProperty = 'next';
    model.nodeDataArray = MARCOS_PROCESSO;
    myDiagram.model = model;
  }
}
