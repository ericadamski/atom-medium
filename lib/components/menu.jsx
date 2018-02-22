"use babel";

import React, { Component } from "react";
import styled, { css } from "styled-components";

import { MarkdownMenu } from "react-markdown-menu";

import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/withLatestFrom";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/partition";
import path from "path";

import header from "../editor/header";
import italic from "../editor/italic";
import quote from "../editor/quote";
import bold from "../editor/bold";
import link from "../editor/link";

const position = position => css`
  position: fixed;
  top: ${position.top}px;
  left: ${position.left}px;
`;

const hide = css`
  visibility: hidden;
`;

const Container = styled.div`
  ${props => position(props.position)};
  ${props => props.hidden && hide};
  border-radius: 0.5em;
  height: 3em;
  background: black;
  z-index: 100;
  display: flex;
  overflow: hidden;
`;

const EditorButton = styled.button`
  background: transparent;
  border: none;
  margin: 0;
  padding: 0 0.5em;
  height: 100%;
  width: 2.5em;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

export default class Menu extends Component {
  state = { hidden: true, line: -1, position: { top: 0, left: 0 } };

  editor = atom.workspace.getActiveTextEditor();

  updateLine(text) {
    this.editor.setTextInBufferRange(
      this.editor.getBuffer().rangeForRow(this.state.line),
      text
    );

    this.editor.setSelectedBufferRange(
      this.editor.getBuffer().rangeForRow(this.state.line)
    );

    this.setState({
      range: this.editor.getSelectedBufferRange()
    });
  }

  updateRange(text) {
    this.editor.setTextInBufferRange(this.state.range, text);

    this.setState({
      range: this.editor.getSelectedBufferRange()
    });
  }

  initializeEvents(editor) {
    if (path.basename(editor.getTitle(), ".md") === editor.getTitle())
      return this.setState({ hidden: true });

    this.subscriber && this.subscriber.unsubscribe();

    const element = atom.views.getView(editor);

    const selection$ = new Subject();

    editor.onDidChangeSelectionRange(selection$.next.bind(selection$));

    const [menu$, click$] = Observable.fromEvent(element, "mouseup")
      .withLatestFrom(
        selection$,
        ({ clientX, clientY }, { newBufferRange }) => ({
          range: newBufferRange,
          left: clientX,
          top: clientY
        })
      )
      .partition(({ range }) => !range.end.isEqual(range.start));

    this.subscriber = Observable.fromEvent(element, "mousewheel")
      .merge(Observable.fromEvent(element, "keydown"))
      .merge(click$)
      .filter(() => !this.state.hidden)
      .subscribe(() => this.setState({ hidden: true }))
      .add(
        menu$
          .map(({ range, left, top }) => ({
            position: { left: left + 10, top: top + 10 },
            line: editor.getCursorBufferPosition().row,
            hidden: false,
            range
          }))
          .subscribe(options => this.setState(options))
      );

    this.editor = editor;
  }

  componentDidMount() {
    atom.workspace.onDidChangeActiveTextEditor(
      this.initializeEvents.bind(this)
    );

    if (this.editor) this.initializeEvents(this.editor);
  }

  onChange(text, line) {
    line ? this.updateLine(text) : this.updateRange(text);
  }

  render() {
    const { position, range, hidden, line } = this.state;

    if (!range || hidden) return null;

    return (
      <MarkdownMenu
        x={position.left}
        y={position.top}
        onChange={this.onChange.bind(this)}
        lineSelection={this.editor.lineTextForBufferRow(line)}
        selection={this.editor.getTextInBufferRange(range)}
      />
    );
  }
}
