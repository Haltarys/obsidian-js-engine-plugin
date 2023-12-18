declare module "jsEngine/Settings" {
    import { type App, PluginSettingTab } from 'obsidian';
    import type JsEnginePlugin from "jsEngine/main";
    export interface JsEnginePluginSettings {
    }
    export const JS_ENGINE_DEFAULT_SETTINGS: JsEnginePluginSettings;
    export class JsEnginePluginSettingTab extends PluginSettingTab {
        plugin: JsEnginePlugin;
        constructor(app: App, plugin: JsEnginePlugin);
        display(): void;
    }
}
declare module "jsEngine/api/markdown/MarkdownElementType" {
    /**
     * @internal
     */
    export enum MarkdownElementType {
        LITERAL = "LITERAL",
        NON_LITERAL = "NON_LITERAL"
    }
}
declare module "jsEngine/api/markdown/MarkdownString" {
    import { type App, type Component } from 'obsidian';
    /**
     * A string that should be rendered as markdown by the plugin.
     */
    export class MarkdownString {
        readonly content: string;
        constructor(content: string);
        /**
         * @internal
         */
        render(app: App, element: HTMLElement, sourcePath: string, component: Component): Promise<void>;
    }
}
declare module "jsEngine/api/markdown/AbstractMarkdownElement" {
    import { type MarkdownElementType } from "jsEngine/api/markdown/MarkdownElementType";
    import { MarkdownString } from "jsEngine/api/markdown/MarkdownString";
    /**
     * @internal
     */
    export abstract class AbstractMarkdownElement {
        /**
         * Converts the element to a string.
         */
        abstract toString(): string;
        /**
         * @internal
         */
        abstract getType(): MarkdownElementType;
        /**
         * Converts the element to a {@link MarkdownString}.
         */
        toMarkdown(): MarkdownString;
    }
}
declare module "jsEngine/api/markdown/AbstractMarkdownLiteral" {
    import { AbstractMarkdownElement } from "jsEngine/api/markdown/AbstractMarkdownElement";
    import { MarkdownElementType } from "jsEngine/api/markdown/MarkdownElementType";
    /**
     * @internal
     */
    export abstract class AbstractMarkdownLiteral extends AbstractMarkdownElement {
        getType(): MarkdownElementType;
    }
}
declare module "jsEngine/api/markdown/AbstractMarkdownElementContainer" {
    import { AbstractMarkdownElement } from "jsEngine/api/markdown/AbstractMarkdownElement";
    import { MarkdownElementType } from "jsEngine/api/markdown/MarkdownElementType";
    import { AbstractMarkdownLiteral } from "jsEngine/api/markdown/AbstractMarkdownLiteral";
    /**
     * @internal
     */
    export abstract class AbstractMarkdownElementContainer extends AbstractMarkdownElement {
        markdownElements: AbstractMarkdownElement[];
        constructor();
        /**
         * @internal
         */
        abstract allowElement(element: AbstractMarkdownElement): boolean;
        getType(): MarkdownElementType;
        /**
         * Adds a child element to the container.
         *
         * @param element
         * @throws Error if the element is not allowed in the container.
         */
        addElement(element: AbstractMarkdownElement): void;
        addText(text: string): AbstractMarkdownElementContainer;
        addBoldText(text: string): AbstractMarkdownElementContainer;
        addCursiveText(text: string): AbstractMarkdownElementContainer;
        addUnderlinedText(text: string): AbstractMarkdownElementContainer;
        addCode(text: string): AbstractMarkdownElementContainer;
        createParagraph(content: string): ParagraphElement;
        createHeading(level: number, content: string): HeadingElement;
        createBlockQuote(): BlockQuoteElement;
        createCallout(title: string, type: string, args?: string): CalloutElement;
        createCodeBlock(language: string, content: string): CodeBlockElement;
        createTable(header: string[], body: string[][]): TableElement;
    }
    /**
     * Represents a piece of pure markdown text.
     */
    export class TextElement extends AbstractMarkdownLiteral {
        content: string;
        bold: boolean;
        cursive: boolean;
        underline: boolean;
        constructor(content: string, bold: boolean, cursive: boolean, underline: boolean);
        toString(): string;
    }
    /**
     * Represents an inline markdown code block.
     */
    export class CodeElement extends AbstractMarkdownLiteral {
        content: string;
        constructor(content: string);
        toString(): string;
    }
    /**
     * Represents a markdown heading.
     */
    export class HeadingElement extends AbstractMarkdownElementContainer {
        level: number;
        constructor(level: number, content: string);
        toString(): string;
        allowElement(element: AbstractMarkdownElement): boolean;
    }
    /**
     * Represents a markdown paragraph.
     */
    export class ParagraphElement extends AbstractMarkdownElementContainer {
        constructor(content: string);
        toString(): string;
        allowElement(element: AbstractMarkdownElement): boolean;
    }
    /**
     * Represents a markdown code block.
     */
    export class CodeBlockElement extends AbstractMarkdownElementContainer {
        language: string;
        constructor(language: string, content: string);
        allowElement(element: AbstractMarkdownElement): boolean;
        toString(): string;
    }
    /**
     * Represents a markdown block quote.
     */
    export class BlockQuoteElement extends AbstractMarkdownElementContainer {
        allowElement(_: AbstractMarkdownElement): boolean;
        toString(): string;
    }
    /**
     * Represents a markdown callout.
     */
    export class CalloutElement extends AbstractMarkdownElementContainer {
        title: string;
        type: string;
        args: string;
        constructor(title: string, type: string, args: string);
        allowElement(_: AbstractMarkdownElement): boolean;
        toString(): string;
    }
    /**
     * Represents a markdown table.
     */
    export class TableElement extends AbstractMarkdownElementContainer {
        header: string[];
        body: string[][];
        constructor(header: string[], body: string[][]);
        allowElement(_: AbstractMarkdownElement): boolean;
        toString(): string;
    }
}
declare module "jsEngine/api/markdown/MarkdownBuilder" {
    import { AbstractMarkdownElementContainer } from "jsEngine/api/markdown/AbstractMarkdownElementContainer";
    import { type AbstractMarkdownElement } from "jsEngine/api/markdown/AbstractMarkdownElement";
    /**
     * Allows for easily building markdown using JavaScript.
     */
    export class MarkdownBuilder extends AbstractMarkdownElementContainer {
        constructor();
        toString(): string;
        allowElement(_: AbstractMarkdownElement): boolean;
    }
}
declare module "jsEngine/api/MarkdownAPI" {
    import { MarkdownBuilder } from "jsEngine/api/markdown/MarkdownBuilder";
    import { MarkdownString } from "jsEngine/api/markdown/MarkdownString";
    import { BlockQuoteElement, CalloutElement, CodeBlockElement, CodeElement, HeadingElement, ParagraphElement, TableElement, TextElement } from "jsEngine/api/markdown/AbstractMarkdownElementContainer";
    import { type API } from "jsEngine/api/API";
    /**
     * The markdown API provides utilities for creating markdown using js.
     */
    export class MarkdownAPI {
        private readonly apiInstance;
        constructor(apiInstance: API);
        /**
         * Creates a markdown builder.
         */
        createBuilder(): MarkdownBuilder;
        /**
         * Creates a markdown string form a normal string.
         * This does not modify the string.
         * It only wraps it in an object, so that the plugin can recognize and render it as markdown.
         *
         * @param markdown the string to wrap
         */
        create(markdown: string): MarkdownString;
        /**
         * Creates a new markdown text element.
         *
         * @param text
         */
        createText(text: string): TextElement;
        /**
         * Creates a new markdown text element with bold formatting.
         *
         * @param text
         */
        createBoldText(text: string): TextElement;
        /**
         * Creates a new markdown text element with cursive formatting.
         *
         * @param text
         */
        createCursiveText(text: string): TextElement;
        /**
         * Creates a new markdown text element with underline formatting.
         *
         * @param text
         */
        createUnderlinedText(text: string): TextElement;
        /**
         * Creates a new markdown code element.
         *
         * @param text
         */
        createCode(text: string): CodeElement;
        /**
         * Creates a new markdown paragraph element.
         *
         * @param content
         */
        createParagraph(content: string): ParagraphElement;
        /**
         * Creates a new markdown heading element.
         *
         * @param level the level of the heading from 1 to 6
         * @param content the text of the heading
         */
        createHeading(level: number, content: string): HeadingElement;
        /**
         * Creates a new markdown block quote element.
         */
        createBlockQuote(): BlockQuoteElement;
        /**
         * Creates a new markdown callout element.
         *
         * @param title the title of the callout
         * @param type the type of the callout
         * @param args the callout args, optional
         */
        createCallout(title: string, type: string, args?: string): CalloutElement;
        /**
         * Creates a new markdown code block element.
         *
         * @param language the language of the code block
         * @param content the content of the code block
         */
        createCodeBlock(language: string, content: string): CodeBlockElement;
        /**
         * Creates a new markdown table element.
         *
         * @param header the header row
         * @param body the table body
         */
        createTable(header: string[], body: string[][]): TableElement;
    }
}
declare module "jsEngine/api/InstanceId" {
    export enum InstanceType {
        JS_EXECUTION = "JS_EXECUTION",
        PLUGIN = "PLUGIN"
    }
    /**
     * Identifies an instance of the API.
     *
     * For the API passed into a JsExecution this is the id of the JsExecution itself.
     */
    export class InstanceId {
        readonly name: InstanceType | string;
        readonly id: string;
        constructor(name: InstanceType | string, id: string);
        static create(name: string): InstanceId;
    }
}
declare module "jsEngine/messages/MessageDisplay" {
    import { type App, Modal } from 'obsidian';
    import type JsEnginePlugin from "jsEngine/main";
    export class MessageDisplay extends Modal {
        /**
         * Reference the JS Engine plugin.
         */
        private readonly plugin;
        private component;
        constructor(app: App, plugin: JsEnginePlugin);
        onOpen(): void;
        onClose(): void;
    }
}
declare module "jsEngine/utils/StoreObj" {
    import { type Subscriber, type Unsubscriber, type Writable } from 'svelte/store';
    export type Store<T> = Writable<T> & {
        get(): T;
        notify(): void;
    };
    export function store<T>(value: T): Store<T>;
    type Invalidator<T> = (value?: T) => void;
    export class StoreObj<T> implements Store<T> {
        private value;
        private subscriberCounter;
        private subscribers;
        constructor(value: T);
        set(newValue: T): void;
        update(fn: (origValue: T) => T): void;
        get(): T;
        subscribe(run: Subscriber<T>, _?: Invalidator<T>): Unsubscriber;
        notify(): void;
    }
}
declare module "jsEngine/utils/Util" {
    export function iteratorToArray<T>(iterator: Iterable<T>): T[];
}
declare module "jsEngine/messages/MessageManager" {
    import { type App } from 'obsidian';
    import type JsEnginePlugin from "jsEngine/main";
    import { type Store } from "jsEngine/utils/StoreObj";
    import type { Moment } from 'moment';
    import { type InstanceId } from "jsEngine/api/InstanceId";
    export enum MessageType {
        INFO = "info",
        TIP = "tip",
        SUCCESS = "success",
        WANING = "warning",
        ERROR = "error"
    }
    export const messageTypeOrder: MessageType[];
    export function mapMessageTypeToClass(messageType: MessageType): string;
    export function mapMessageTypeToIcon(messageType: MessageType): string;
    export function mapMessageTypeToMessageIndicatorClass(messageType: MessageType): string;
    export class Message {
        type: MessageType;
        title: string;
        content: string;
        code: string;
        constructor(type: MessageType, title: string, content: string, code: string);
    }
    export class MessageWrapper {
        uuid: string;
        source: InstanceId;
        message: Message;
        time: Moment;
        constructor(message: Message, source: InstanceId);
    }
    export class MessageManager {
        /**
         * Reference to the obsidian app.
         */
        private readonly app;
        /**
         * Reference the JS Engine plugin.
         */
        private readonly plugin;
        messages: Store<Map<string, MessageWrapper>>;
        statusBarItem: HTMLElement | undefined;
        private messageDisplay;
        constructor(app: App, plugin: JsEnginePlugin);
        initStatusBarItem(): void;
        addMessage(message: Message, source: InstanceId): MessageWrapper;
        removeMessage(id: string): void;
        private updateStatusBarItem;
        getMessagesFromSource(source: InstanceId): MessageWrapper[];
    }
}
declare module "jsEngine/api/MessageAPI" {
    import { type API } from "jsEngine/api/API";
    import { type MessageManager, type MessageType, type MessageWrapper } from "jsEngine/messages/MessageManager";
    export class MessageAPI {
        readonly apiInstance: API;
        readonly messageManager: MessageManager;
        constructor(apiInstance: API);
        createMessage(type: MessageType, title: string, content: string, code?: string): MessageWrapper;
        getMessageById(id: string): MessageWrapper | undefined;
        getMessagesForInstance(): MessageWrapper[];
    }
}
declare module "jsEngine/engine/ResultRenderer" {
    import { type Component } from 'obsidian';
    import type JsEnginePlugin from "jsEngine/main";
    /**
     * Attaches to a container and renders values.
     * Used to render the result of a {@link JsExecution}.
     */
    export class ResultRenderer {
        readonly plugin: JsEnginePlugin;
        readonly container: HTMLElement;
        readonly sourcePath: string;
        readonly component: Component;
        constructor(plugin: JsEnginePlugin, container: HTMLElement, sourcePath: string, component: Component);
        /**
         * Renders the given value to the container.
         *
         * @param value The value to render.
         */
        render(value: unknown): Promise<void>;
        /**
         * Converts the given value to a simple object.
         * E.g. a {@link MarkdownBuilder} will be converted to a string.
         *
         * @param value The value to convert.
         * @returns The simple object.
         */
        convertToSimpleObject(value: unknown): unknown;
    }
}
declare module "jsEngine/engine/ExecutionStatsModal" {
    import { type App, Modal } from 'obsidian';
    import type JsEnginePlugin from "jsEngine/main";
    import { type JsExecution } from "jsEngine/engine/JsExecution";
    /**
     * @internal
     */
    export class ExecutionStatsModal extends Modal {
        private readonly plugin;
        private component;
        private execution;
        constructor(app: App, plugin: JsEnginePlugin);
        setExecution(execution: JsExecution): void;
        onOpen(): void;
        onClose(): void;
    }
}
declare module "jsEngine/engine/Engine" {
    import type JsEnginePlugin from "jsEngine/main";
    import { type App, type Component } from 'obsidian';
    import { JsExecution, type JsExecutionContext } from "jsEngine/engine/JsExecution";
    /**
     * Parameters for the {@link Engine.execute} method.
     */
    export interface EngineExecutionParams {
        /**
         * The JavaScript code to execute.
         */
        code: string;
        /**
         * Obsidian Component for lifecycle management.
         */
        component: Component;
        /**
         * Optional container element to render results to.
         */
        container?: HTMLElement | undefined;
        /**
         * Optional context to provide to the JavaScript code.
         */
        context?: JsExecutionContext | undefined;
        /**
         * Optional extra context variables to provide to the JavaScript code.
         */
        contextOverrides?: Record<string, unknown> | undefined;
    }
    export class Engine {
        private readonly app;
        private readonly plugin;
        private executionStatsModal;
        readonly activeExecutions: Map<string, JsExecution>;
        constructor(app: App, plugin: JsEnginePlugin);
        /**
         * Execute JavaScript code.
         *
         * @param params
         */
        execute(params: EngineExecutionParams): Promise<JsExecution>;
        /**
         * Open the execution stats modal for a given {@link JsExecution}.
         *
         * @param jsExecution
         */
        openExecutionStatsModal(jsExecution: JsExecution): void;
    }
}
declare module "jsEngine/engine/JsExecution" {
    import { type App, type CachedMetadata, type Component, type TFile } from 'obsidian';
    import type JsEnginePlugin from "jsEngine/main";
    import { type MessageWrapper } from "jsEngine/messages/MessageManager";
    import { API } from "jsEngine/api/API";
    import * as Obsidian from 'obsidian';
    import { type EngineExecutionParams } from "jsEngine/engine/Engine";
    /**
     * An async JavaScript function.
     */
    export type JsFunc = (...args: unknown[]) => Promise<unknown>;
    /**
     * Context provided to a {@link JsExecution}.
     */
    export interface JsExecutionContext {
        file: TFile;
        metadata: CachedMetadata | null;
        line: number;
    }
    /**
     * Global variables provided to a {@link JsExecution}.
     */
    export interface JsExecutionGlobals {
        app: App;
        engine: API;
        component: Component;
        context: (JsExecutionContext | undefined) & Record<string, unknown>;
        container: HTMLElement | undefined;
        obsidian: typeof Obsidian;
    }
    /**
     * Parameters used to construct a {@link JsExecution}.
     */
    export interface JsExecutionParams extends EngineExecutionParams {
        app: App;
        plugin: JsEnginePlugin;
    }
    /**
     * Models the execution of a JavaScript string.
     */
    export class JsExecution {
        readonly app: App;
        readonly plugin: JsEnginePlugin;
        private readonly globals;
        private readonly context;
        private readonly apiInstance;
        private messages;
        private func;
        readonly uuid: string;
        readonly code: string;
        result: unknown;
        functionBuildError: Error | undefined;
        functionRunError: Error | undefined;
        functionBuildTime: number | undefined;
        functionRunTime: number | undefined;
        constructor(params: JsExecutionParams);
        /**
         * Creates the function from the code provided in the constructor.
         */
        buildFunction(): void;
        /**
         * Runs the function created by {@link JsExecution.buildFunction}.
         */
        runFunction(): Promise<void>;
        /**
         * Returns true if the function was built and run without errors.
         */
        isSuccessful(): boolean;
        /**
         * Returns the messages generated by the function.
         */
        getMessages(): MessageWrapper[];
        /**
         * Opens the execution stats modal for this execution.
         */
        openStatsModal(): void;
    }
}
declare module "jsEngine/api/reactive/ReactiveComponent" {
    import { type ResultRenderer } from "jsEngine/engine/ResultRenderer";
    import { type JsFunc } from "jsEngine/engine/JsExecution";
    /**
     * A reactive component is a component that can be refreshed.
     * This is useful for rendering dynamic content.
     *
     * See {@link API.reactive}
     */
    export class ReactiveComponent {
        private readonly _render;
        private readonly initialArgs;
        /**
         * @internal
         */
        renderer: ResultRenderer | undefined;
        constructor(_render: JsFunc, initialArgs: unknown[]);
        /**
         * Refreshes the component by rerunning the render function with the arguments passed into this function.
         *
         * @param args
         */
        refresh(...args: unknown[]): Promise<void>;
        /**
         * @internal
         */
        initialRender(): void;
        /**
         * @internal
         */
        setRenderer(renderer: ResultRenderer): void;
    }
}
declare module "jsEngine/api/LibAPI" {
    import { type API } from "jsEngine/api/API";
    import { P } from '@lemons_dev/parsinom/lib/ParsiNOM';
    import { P_UTILS } from '@lemons_dev/parsinom/lib/ParserUtils';
    import { Parser } from '@lemons_dev/parsinom/lib/Parser';
    import { createParsingErrorMessage, ParsingError } from '@lemons_dev/parsinom/lib/ParserError';
    import { ParserContext } from '@lemons_dev/parsinom/lib/ParserContext';
    import * as IterTools from 'itertools-ts';
    export interface LibParsiNOM {
        P: typeof P;
        P_UTILS: typeof P_UTILS;
        Parser: typeof Parser;
        createParsingErrorMessage: typeof createParsingErrorMessage;
        ParsingError: typeof ParsingError;
        ParserContext: typeof ParserContext;
    }
    /**
     * The lib API provides in interface to some external libraries packaged into js engine.
     */
    export class LibAPI {
        private readonly apiInstance;
        constructor(apiInstance: API);
        /**
         * Get the [ParsiNOM](https://github.com/mProjectsCode/parsiNOM) library.
         */
        parsinom(): LibParsiNOM;
        /**
         * Get the [itertools-ts](https://github.com/Smoren/itertools-ts) library.
         */
        itertools(): typeof IterTools;
    }
}
declare module "jsEngine/api/Internal" {
    import { type API } from "jsEngine/api/API";
    import { type EngineExecutionParams } from "jsEngine/engine/Engine";
    import { type JsExecution } from "jsEngine/engine/JsExecution";
    import { type Component } from 'obsidian';
    import { ResultRenderer } from "jsEngine/engine/ResultRenderer";
    /**
     * The internal API provides access to some of js engines internals.
     */
    export class InternalAPI {
        private readonly apiInstance;
        constructor(apiInstance: API);
        /**
         * Executes the given code.
         *
         * @param params
         */
        execute(params: EngineExecutionParams): Promise<JsExecution>;
        /**
         * Creates a result renderer.
         *
         * @param container
         * @param sourcePath
         * @param component
         */
        createRenderer(container: HTMLElement, sourcePath: string, component: Component): ResultRenderer;
        /**
         * Load and execute the given file.
         *
         * @param path
         * @param params
         */
        executeFile(path: string, params: Omit<EngineExecutionParams, 'code'>): Promise<JsExecution>;
    }
}
declare module "jsEngine/api/API" {
    import { MarkdownAPI } from "jsEngine/api/MarkdownAPI";
    import { type App, type Plugin } from 'obsidian';
    import type JsEnginePlugin from "jsEngine/main";
    import { type InstanceId } from "jsEngine/api/InstanceId";
    import { MessageAPI } from "jsEngine/api/MessageAPI";
    import { ReactiveComponent } from "jsEngine/api/reactive/ReactiveComponent";
    import { LibAPI } from "jsEngine/api/LibAPI";
    import { type JsFunc } from "jsEngine/engine/JsExecution";
    import { InternalAPI } from "jsEngine/api/Internal";
    export class API {
        /**
         * Reference to the obsidian app.
         */
        readonly app: App;
        /**
         * Reference the JS Engine plugin.
         */
        readonly plugin: JsEnginePlugin;
        readonly instanceId: InstanceId;
        /**
         * API to interact with markdown.
         */
        readonly markdown: MarkdownAPI;
        /**
         * API to interact with the plugins message system.
         */
        readonly message: MessageAPI;
        /**
         * API to interact with packaged libraries.
         */
        readonly lib: LibAPI;
        /**
         * API to interact with js engines internals.
         */
        readonly internal: InternalAPI;
        constructor(app: App, plugin: JsEnginePlugin, instanceId: InstanceId);
        /**
         * Loads an ECMAScript module from a vault relative path.
         *
         * @param path the vault relative path of the file to import
         */
        importJs(path: string): Promise<unknown>;
        /**
         * Gets a plugin by its id. A plugin id can be found by looking at its manifest.
         *
         * @param pluginId the id of the plugin.
         */
        getPlugin(pluginId: string): Plugin;
        /**
         * Creates a reactive component.
         * Reactive components are useful for creating dynamic content.
         *
         * @param fn the function to rerun. It's return value will be rendered.
         * @param initialArgs the initial arguments (for the first render) to pass to the function.
         */
        reactive(fn: JsFunc, ...initialArgs: unknown[]): ReactiveComponent;
    }
}
declare module "jsEngine/main" {
    import { type App, Plugin, type PluginManifest } from 'obsidian';
    import { type JsEnginePluginSettings } from "jsEngine/Settings";
    import { API } from "jsEngine/api/API";
    import { MessageManager } from "jsEngine/messages/MessageManager";
    import { Engine } from "jsEngine/engine/Engine";
    export default class JsEnginePlugin extends Plugin {
        settings: JsEnginePluginSettings | undefined;
        messageManager: MessageManager;
        jsEngine: Engine;
        api: API;
        constructor(app: App, manifest: PluginManifest);
        onload(): Promise<void>;
        onunload(): void;
        loadSettings(): Promise<void>;
        saveSettings(): Promise<void>;
        /**
         * Inspired by https://github.com/SilentVoid13/Templater/blob/487805b5ad1fd7fbc145040ed82b4c41fc2c48e2/src/editor/Editor.ts#L67
         */
        registerCodeMirrorMode(): Promise<void>;
    }
}
declare module "jsEngine/JsMDRC" {
    import { type MarkdownPostProcessorContext, MarkdownRenderChild, TFile } from 'obsidian';
    import type JsEnginePlugin from "jsEngine/main";
    import { type JsExecutionContext, type JsExecution } from "jsEngine/engine/JsExecution";
    export class JsMDRC extends MarkdownRenderChild {
        plugin: JsEnginePlugin;
        content: string;
        ctx: MarkdownPostProcessorContext;
        jsExecution: JsExecution | undefined;
        constructor(containerEl: HTMLElement, plugin: JsEnginePlugin, content: string, ctx: MarkdownPostProcessorContext);
        getExecutionFile(): TFile | undefined;
        buildExecutionContext(): JsExecutionContext;
        tryRun(context: JsExecutionContext): Promise<JsExecution>;
        renderResults(container: HTMLElement): Promise<void>;
        renderExecutionStats(container: HTMLElement): void;
        render(): Promise<void>;
        onload(): Promise<void>;
        onunload(): void;
    }
}
