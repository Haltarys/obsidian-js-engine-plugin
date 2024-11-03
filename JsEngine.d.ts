declare module 'api/InstanceId' {
	export enum InstanceType {
		JS_EXECUTION = 'JS_EXECUTION',
		PLUGIN = 'PLUGIN',
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
		toString(): string;
		static create(name: string): InstanceId;
	}
}
declare module 'fileRunner/JSFileSelectModal' {
	import type JsEnginePlugin from 'main';
	import { FuzzySuggestModal, TFile } from 'obsidian';
	export class JSFileSelectModal extends FuzzySuggestModal<TFile> {
		plugin: JsEnginePlugin;
		selectCallback: (selected: TFile) => void | Promise<void>;
		constructor(plugin: JsEnginePlugin, selectCallback: (selected: TFile) => void | Promise<void>);
		getItems(): TFile[];
		getItemText(item: TFile): string;
		onChooseItem(item: TFile, _evt: MouseEvent | KeyboardEvent): void;
	}
}
declare module 'utils/SvelteUtils' {
	import type { Component, SvelteComponent } from 'svelte';
	export type AnyRecord = Record<string, any>;
	export type UnknownRecord = Record<string, unknown>;
	type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
	export type ComponentExports<Comp extends Component<any, any> | SvelteComponent> =
		Comp extends SvelteComponent<any, infer Exports> ? IfAny<Exports, AnyRecord, Exports> : AnyRecord;
	export type MountedComponent<Comp extends Component<any, any> | SvelteComponent> = ComponentExports<Comp>;
	export type AnySvelteComponent = Component<any, any>;
}
declare module 'messages/MessageDisplay' {
	import type JsEnginePlugin from 'main';
	import type { App } from 'obsidian';
	import { Modal } from 'obsidian';
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
declare module 'utils/Signal' {
	export interface NotifierInterface<T, TListener extends Listener<T>> {
		registerListener(listener: Omit<TListener, 'uuid'>): TListener;
		unregisterListener(listener: TListener): void;
		unregisterListenerById(listenerId: string): void;
		notifyListeners(value: T): void;
	}
	export class Notifier<T, TListener extends Listener<T>> implements NotifierInterface<T, TListener> {
		private listeners;
		constructor();
		registerListener(listener: Omit<TListener, 'uuid'>): TListener;
		unregisterListener(listener: TListener): void;
		unregisterListenerById(listenerId: string): void;
		unregisterAllListeners(): void;
		notifyListeners(value: T): void;
	}
	export interface Listener<T> {
		uuid: string;
		callback: ListenerCallback<T>;
	}
	export type ListenerCallback<T> = (value: T) => void;
	export type SignalLike<T> = Signal<T> | ComputedSignal<unknown, T>;
	export class Signal<T> extends Notifier<T, Listener<T>> {
		private value;
		constructor(value: T);
		get(): T;
		set(value: T): void;
		update(fn: (value: T) => T): void;
	}
	export class ComputedSignal<R, T> extends Notifier<T, Listener<T>> {
		private value;
		private readonly dependency;
		private readonly dependencyListener;
		constructor(dependency: SignalLike<R>, compute: (signal: R) => T);
		get(): T;
		set(value: T): void;
		destroy(): void;
	}
}
declare module 'utils/Util' {
	export function iteratorToArray<T>(iterator: Iterable<T>): T[];
	export enum ButtonStyleType {
		DEFAULT = 'default',
		PRIMARY = 'primary',
		DESTRUCTIVE = 'destructive',
		PLAIN = 'plain',
	}
	export function mod(a: number, b: number): number;
}
declare module 'messages/MessageManager' {
	import type { InstanceId } from 'api/InstanceId';
	import type JsEnginePlugin from 'main';
	import { Signal } from 'utils/Signal';
	import type { Moment } from 'moment';
	import type { App } from 'obsidian';
	export enum MessageType {
		INFO = 'info',
		TIP = 'tip',
		SUCCESS = 'success',
		WANING = 'warning',
		ERROR = 'error',
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
		messages: Signal<MessageWrapper[]>;
		statusBarItem: HTMLElement | undefined;
		private messageDisplay;
		constructor(app: App, plugin: JsEnginePlugin);
		initStatusBarItem(): void;
		addMessage(message: Message, source: InstanceId): MessageWrapper;
		removeMessage(id: string): void;
		removeAllMessages(): void;
		private updateStatusBarItem;
		getMessagesFromSource(source: InstanceId): MessageWrapper[];
	}
}
declare module 'Settings' {
	import type JsEnginePlugin from 'main';
	import type { App } from 'obsidian';
	import { PluginSettingTab } from 'obsidian';
	export interface JsEnginePluginSettings {}
	export const JS_ENGINE_DEFAULT_SETTINGS: JsEnginePluginSettings;
	export class JsEnginePluginSettingTab extends PluginSettingTab {
		plugin: JsEnginePlugin;
		constructor(app: App, plugin: JsEnginePlugin);
		display(): void;
	}
}
declare module 'api/markdown/MarkdownElementType' {
	/**
	 * @internal
	 */
	export enum MarkdownElementType {
		LITERAL = 'LITERAL',
		NON_LITERAL = 'NON_LITERAL',
	}
}
declare module 'api/markdown/MarkdownString' {
	import type { API } from 'api/API';
	import type { App, Component } from 'obsidian';
	/**
	 * A string that should be rendered as markdown by the plugin.
	 */
	export class MarkdownString {
		readonly content: string;
		readonly apiInstance: API;
		constructor(apiInstance: API, content: string);
		/**
		 * @internal
		 */
		render(app: App, element: HTMLElement, sourcePath: string, component: Component): Promise<void>;
	}
}
declare module 'api/markdown/AbstractMarkdownElement' {
	import type { API } from 'api/API';
	import type { MarkdownElementType } from 'api/markdown/MarkdownElementType';
	import { MarkdownString } from 'api/markdown/MarkdownString';
	/**
	 * @internal
	 */
	export abstract class AbstractMarkdownElement {
		readonly apiInstance: API;
		constructor(apiInstance: API);
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
declare module 'api/prompts/Suggester' {
	import type { SuggesterOption, SuggesterPromptOptions } from 'api/PromptAPI';
	import type { App } from 'obsidian';
	import { FuzzySuggestModal } from 'obsidian';
	export class Suggester<T> extends FuzzySuggestModal<SuggesterOption<T>> {
		private readonly options;
		private readonly onSubmit;
		private selectedValue;
		constructor(app: App, options: SuggesterPromptOptions<T>, onSubmit: (value: T | undefined) => void);
		getItems(): SuggesterOption<T>[];
		getItemText(item: SuggesterOption<T>): string;
		onChooseItem(item: SuggesterOption<T>, _: MouseEvent | KeyboardEvent): void;
		onOpen(): void;
		onClose(): void;
	}
}
declare module 'api/prompts/SvelteModal' {
	import type { ModalPromptOptions } from 'api/PromptAPI';
	import type { AnySvelteComponent, MountedComponent } from 'utils/SvelteUtils';
	import type { App } from 'obsidian';
	import { Modal } from 'obsidian';
	export class SvelteModal<Component extends AnySvelteComponent, T> extends Modal {
		private component;
		private readonly options;
		private readonly createComponent;
		private readonly onSubmit;
		private submitted;
		constructor(
			app: App,
			options: ModalPromptOptions,
			createComponent: (modal: SvelteModal<Component, T>, targetEl: HTMLElement) => MountedComponent<Component>,
			onSubmit: (value: T | undefined) => void,
		);
		onOpen(): void;
		onClose(): void;
		submit(value: T): void;
	}
}
declare module 'api/PromptAPI' {
	import type { API } from 'api/API';
	import { ButtonStyleType } from 'utils/Util';
	/**
	 * Basic options for a prompt modal.
	 * This interface is used as a base for other prompt options.
	 */
	export interface ModalPromptOptions {
		/**
		 * The title of the modal.
		 */
		title: string;
		/**
		 * A list of CSS classes to apply to the modal.
		 */
		classes?: string[];
	}
	export interface ButtonPromptOptions<T> extends ModalPromptOptions {
		/**
		 * Text content to display in the modal.
		 */
		content?: string;
		/**
		 * A list of buttons to display in the modal.
		 */
		buttons: ButtonPromptButtonOptions<T>[];
	}
	export interface ButtonPromptButtonOptions<T> {
		label: string;
		value: T;
		variant?: ButtonStyleType;
	}
	export interface ConfirmPromptOptions extends ModalPromptOptions {
		/**
		 * Text content to display in the modal.
		 */
		content?: string;
	}
	export interface YesNoPromptOptions extends ModalPromptOptions {
		/**
		 * Text content to display in the modal.
		 */
		content?: string;
	}
	export interface SuggesterPromptOptions<T> {
		placeholder?: string;
		options: SuggesterOption<T>[];
	}
	export interface SuggesterOption<T> {
		value: T;
		label: string;
	}
	export interface InputPromptOptions extends ModalPromptOptions {
		/**
		 * Text content to display in the modal.
		 */
		content?: string;
		/**
		 * The placeholder text for the input field. This will show when the input field is empty.
		 */
		placeholder?: string;
		/**
		 * The initial value of the input field that is pre-filled when the modal is opened.
		 */
		initialValue?: string;
	}
	export interface NumberInputPromptOptions extends ModalPromptOptions {
		/**
		 * Text content to display in the modal.
		 */
		content?: string;
		/**
		 * The placeholder text for the input field. This will show when the input field is empty.
		 */
		placeholder?: string;
		/**
		 * The initial value of the input field that is pre-filled when the modal is opened.
		 */
		initialValue?: number;
	}
	export class PromptAPI {
		readonly apiInstance: API;
		constructor(apiInstance: API);
		/**
		 * Prompts the user with a modal containing a list of buttons.
		 * Returns the value of the button that was clicked, or undefined if the modal was closed.
		 *
		 * @example
		 * ```typescript
		 * // Prompt the user with a true/false question.
		 *
		 * const ret = await engine.prompt.button({
		 *     title: 'The set of natural numbers with zero and the addition operation is a monoid.',
		 *     buttons: [
		 *         {
		 *             label: 'True',
		 *             value: true,
		 *         },
		 *         {
		 *             label: 'False',
		 *             value: false,
		 *         },
		 *         {
		 *             label: 'Cancel',
		 *             value: undefined,
		 *         }
		 *     ]
		 * });
		 * ```
		 */
		button<T>(options: ButtonPromptOptions<T>): Promise<T | undefined>;
		/**
		 * Prompts the user with a confirm/cancel dialog.
		 * Returns true if the user confirms, false if the user cancels or otherwise closes the modal.
		 *
		 * @example
		 * ```typescript
		 * // Ask the user if they want to confirm an action.
		 *
		 * const ret = await engine.prompt.confirm({
		 *     title: 'Confirm File Deletion',
		 *     content: 'Are you sure you want to delete this file? This action cannot be undone.',
		 * });
		 * ```
		 */
		confirm(options: ConfirmPromptOptions): Promise<boolean>;
		/**
		 * Prompts the user with a yes/no dialog.
		 * Returns true if the user selects yes, false if the user selects no, and undefined if the user otherwise closes the modal.
		 *
		 * @example
		 * ```typescript
		 * // Ask the user if they like Obsidian.
		 *
		 * const ret = await engine.prompt.yesNo({
		 *     title: 'Is this a test?',
		 *     content: 'Are you sure this is a test? Are you sure that your choice is really meaningless?',
		 * });
		 * ```
		 */
		yesNo(options: YesNoPromptOptions): Promise<boolean | undefined>;
		/**
		 * Prompts the user with a fuzzy finder suggester dialog.
		 * Returns the value of the selected option, or undefined if the user closes the modal.
		 *
		 * @example
		 * ```typescript
		 * // Query a list of files and prompt the user to select one.
		 *
		 * const files = engine.query.files((file) => {
		 *     return {
		 *         label: file.name,
		 *         value: file.pat,
		 *     };
		 * });
		 *
		 * const ret = await engine.prompt.suggester({
		 *     placeholder: 'Select a file',
		 *     options: files,
		 * });
		 * ```
		 */
		suggester<T>(options: SuggesterPromptOptions<T>): Promise<T | undefined>;
		/**
		 * Prompts the user with a text input dialog.
		 * Returns the value of the input field, or undefined if the user closes the modal.
		 * While the input field is focused, the user can use `enter` to submit the value and `esc` to cancel and close the modal.
		 *
		 * @example
		 * ```typescript
		 * // Prompt the user to input their name.
		 *
		 * const ret = await engine.prompt.text({
		 *     title: 'Please enter your name',
		 *     content: 'Please enter your name in the field below.',
		 * });
		 * ```
		 */
		text(options: InputPromptOptions): Promise<string | undefined>;
		/**
		 * Prompts the user with a textarea input dialog.
		 * Returns the value of the input field, or undefined if the user closes the modal.
		 * While the input field is focused, the user can use `esc` to cancel and close the modal.
		 *
		 * @example
		 * ```typescript
		 * // Prompt the user to input a multi-line message.
		 *
		 * const ret = await engine.prompt.textarea({
		 *     title: 'Please enter your message',
		 *     content: 'Please enter your message in the field below.',
		 *     placeholder: 'Your message here...',
		 * });
		 * ```
		 */
		textarea(options: InputPromptOptions): Promise<string | undefined>;
		/**
		 * Prompts the user with a number input dialog.
		 * Returns the value of the input field, or undefined if the user closes the modal.
		 * While the input field is focused, the user can use `enter` to submit the value and `esc` to cancel and close the modal.
		 *
		 * @example
		 * ```typescript
		 * // Prompt the user to input their age.
		 *
		 * const ret = await engine.prompt.text({
		 *     title: 'Please enter your age',
		 *     content: 'Please enter your age in years in the field below.',
		 * });
		 * ```
		 */
		number(options: NumberInputPromptOptions): Promise<number | undefined>;
	}
}
declare module 'utils/Errors' {
	export enum ErrorLevel {
		CRITICAL = 'CRITICAL',
		ERROR = 'ERROR',
		WARNING = 'WARNING',
	}
	export enum ErrorType {
		INTERNAL = 'JSE_INTERNAL',
		VALIDATION = 'JSE_VALIDATION',
		OTHER = 'OTHER',
	}
	interface JSEngineErrorParams {
		errorLevel: ErrorLevel;
		effect: string;
		cause: string | Error;
		tip?: string;
		docs?: string[];
		context?: Record<string, unknown>;
		positionContext?: string;
	}
	export abstract class JSEngineError extends Error {
		abstract getErrorType(): ErrorType;
		errorLevel: ErrorLevel;
		effect: string;
		cause: string | Error;
		tip?: string;
		docs?: string[];
		context?: Record<string, unknown>;
		positionContext?: string;
		constructor(params: JSEngineErrorParams);
		protected updateMessage(): void;
		log(): void;
	}
	export class JSEngineInternalError extends JSEngineError {
		getErrorType(): ErrorType;
	}
	export class JSEngineValidationError extends JSEngineError {
		getErrorType(): ErrorType;
	}
}
declare module 'utils/Validators' {
	import { AbstractMarkdownElement } from 'api/markdown/AbstractMarkdownElement';
	import type {
		ButtonPromptButtonOptions,
		ButtonPromptOptions,
		ConfirmPromptOptions,
		InputPromptOptions,
		NumberInputPromptOptions,
		SuggesterOption,
		SuggesterPromptOptions,
		YesNoPromptOptions,
	} from 'api/PromptAPI';
	import type { EngineExecutionParams } from 'engine/Engine';
	import type { Block, JsExecutionContext, JsExecutionGlobalsConstructionOptions } from 'engine/JsExecution';
	import { MessageType } from 'messages/MessageManager';
	import { ButtonStyleType } from 'utils/Util';
	import type { CachedMetadata } from 'obsidian';
	import { Component, TFile } from 'obsidian';
	import { z } from 'zod';
	export function schemaForType<T>(): <S extends z.ZodType<T, any, any>>(arg: S) => S;
	export function validateAPIArgs<T>(validator: z.ZodType<T>, args: T): void;
	export class Validators {
		htmlElement: z.ZodType<HTMLElement, any, any>;
		voidFunction: z.ZodType<() => void, any, any>;
		component: z.ZodType<Component, any, any>;
		tFile: z.ZodType<TFile, any, any>;
		cachedMetadata: z.ZodType<CachedMetadata, any, any>;
		block: z.ZodType<Block, any, any>;
		jsExecutionContext: z.ZodType<JsExecutionContext, any, any>;
		engineExecutionParams: z.ZodType<EngineExecutionParams, any, any>;
		engineExecutionParamsNoCode: z.ZodType<Omit<EngineExecutionParams, 'code'>, any, any>;
		engineExecutionParamsNoCodeAndComponent: z.ZodType<Omit<EngineExecutionParams, 'code' | 'component'>, any, any>;
		jsExecutionGlobalsConstructionOptions: z.ZodType<JsExecutionGlobalsConstructionOptions, any, any>;
		abstractMarkdownElement: z.ZodType<AbstractMarkdownElement, any, any>;
		messageType: z.ZodType<MessageType, any, any>;
		buttonStyleType: z.ZodType<ButtonStyleType, any, any>;
		buttonPromptButtonOptions: z.ZodType<ButtonPromptButtonOptions<unknown>, any, any>;
		buttonModalPromptOptions: z.ZodType<ButtonPromptOptions<unknown>, any, any>;
		confirmPromptOptions: z.ZodType<ConfirmPromptOptions, any, any>;
		yesNoPromptOptions: z.ZodType<YesNoPromptOptions, any, any>;
		suggesterOption: z.ZodType<SuggesterOption<unknown>, any, any>;
		suggesterPromptOptions: z.ZodType<SuggesterPromptOptions<unknown>, any, any>;
		inputPromptOptions: z.ZodType<InputPromptOptions, any, any>;
		numberInputPromptOptions: z.ZodType<NumberInputPromptOptions, any, any>;
		constructor();
	}
}
declare module 'main' {
	import { API } from 'api/API';
	import { Engine } from 'engine/Engine';
	import { MessageManager } from 'messages/MessageManager';
	import type { JsEnginePluginSettings } from 'Settings';
	import { Validators } from 'utils/Validators';
	import type { App, PluginManifest } from 'obsidian';
	import { Plugin } from 'obsidian';
	export default class JsEnginePlugin extends Plugin {
		settings: JsEnginePluginSettings | undefined;
		messageManager: MessageManager;
		jsEngine: Engine;
		api: API;
		validators: Validators;
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
declare module 'engine/ExecutionStatsModal' {
	import type { JsExecution } from 'engine/JsExecution';
	import type JsEnginePlugin from 'main';
	import type { App } from 'obsidian';
	import { Modal } from 'obsidian';
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
declare module 'engine/Engine' {
	import type { JsExecutionContext } from 'engine/JsExecution';
	import { JsExecution } from 'engine/JsExecution';
	import type JsEnginePlugin from 'main';
	import type { App, Component } from 'obsidian';
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
declare module 'api/markdown/AbstractMarkdownLiteral' {
	import { AbstractMarkdownElement } from 'api/markdown/AbstractMarkdownElement';
	import { MarkdownElementType } from 'api/markdown/MarkdownElementType';
	/**
	 * @internal
	 */
	export abstract class AbstractMarkdownLiteral extends AbstractMarkdownElement {
		getType(): MarkdownElementType;
	}
}
declare module 'api/markdown/AbstractMarkdownElementContainer' {
	import type { API } from 'api/API';
	import { AbstractMarkdownElement } from 'api/markdown/AbstractMarkdownElement';
	import { AbstractMarkdownLiteral } from 'api/markdown/AbstractMarkdownLiteral';
	import { MarkdownElementType } from 'api/markdown/MarkdownElementType';
	/**
	 * @internal
	 */
	export abstract class AbstractMarkdownElementContainer extends AbstractMarkdownElement {
		markdownElements: AbstractMarkdownElement[];
		constructor(apiInstance: API);
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
		addHighlightedText(text: string): AbstractMarkdownElementContainer;
		addCode(text: string): AbstractMarkdownElementContainer;
		createParagraph(content: string): ParagraphElement;
		createHeading(level: number, content: string): HeadingElement;
		createBlockQuote(): BlockQuoteElement;
		createCallout(title: string, type: string, args?: string): CalloutElement;
		createCollapsibleCallout(title: string, type: string, args?: string, collapsed?: boolean): CalloutElement;
		createCodeBlock(language: string, content: string): CodeBlockElement;
		createTable(header: string[], body: string[][]): TableElement;
		createList(ordered?: boolean): ListElement;
		createOrderedList(): ListElement;
	}
	/**
	 * Represents a piece of pure markdown text.
	 */
	export class TextElement extends AbstractMarkdownLiteral {
		content: string;
		bold: boolean;
		cursive: boolean;
		underline: boolean;
		highlight: boolean;
		constructor(apiInstance: API, content: string, bold: boolean, cursive: boolean, underline: boolean, highlight: boolean);
		toString(): string;
	}
	/**
	 * Represents an inline markdown code block.
	 */
	export class CodeElement extends AbstractMarkdownLiteral {
		content: string;
		constructor(apiInstance: API, content: string);
		toString(): string;
	}
	/**
	 * Represents a markdown table.
	 */
	export class TableElement extends AbstractMarkdownLiteral {
		header: string[];
		body: string[][];
		constructor(apiInstance: API, header: string[], body: string[][]);
		toString(): string;
	}
	/**
	 * Represents a markdown heading.
	 */
	export class HeadingElement extends AbstractMarkdownElementContainer {
		level: number;
		constructor(apiInstance: API, level: number, content: string);
		toString(): string;
		allowElement(element: AbstractMarkdownElement): boolean;
	}
	/**
	 * Represents a markdown paragraph.
	 */
	export class ParagraphElement extends AbstractMarkdownElementContainer {
		constructor(apiInstance: API, content: string);
		toString(): string;
		allowElement(element: AbstractMarkdownElement): boolean;
	}
	/**
	 * Represents a markdown code block.
	 */
	export class CodeBlockElement extends AbstractMarkdownElementContainer {
		language: string;
		constructor(apiInstance: API, language: string, content: string);
		toString(): string;
		allowElement(element: AbstractMarkdownElement): boolean;
	}
	/**
	 * Represents a markdown block quote.
	 */
	export class BlockQuoteElement extends AbstractMarkdownElementContainer {
		toString(): string;
		allowElement(_: AbstractMarkdownElement): boolean;
	}
	/**
	 * Represents a markdown callout.
	 */
	export class CalloutElement extends AbstractMarkdownElementContainer {
		title: string;
		type: string;
		args: string;
		collapsible: boolean;
		collapsed: boolean;
		constructor(apiInstance: API, title: string, type: string, args: string, collapsible?: boolean, collapsed?: boolean);
		toString(): string;
		private collapseChar;
		allowElement(_: AbstractMarkdownElement): boolean;
	}
	export class ListElement extends AbstractMarkdownElementContainer {
		ordered: boolean;
		constructor(apiInstance: API, ordered: boolean);
		private getPrefix;
		toString(): string;
		allowElement(_: AbstractMarkdownElement): boolean;
	}
}
declare module 'api/markdown/MarkdownBuilder' {
	import type { API } from 'api/API';
	import type { AbstractMarkdownElement } from 'api/markdown/AbstractMarkdownElement';
	import { AbstractMarkdownElementContainer } from 'api/markdown/AbstractMarkdownElementContainer';
	/**
	 * Allows for easily building markdown using JavaScript.
	 */
	export class MarkdownBuilder extends AbstractMarkdownElementContainer {
		constructor(apiInstance: API);
		toString(): string;
		allowElement(_: AbstractMarkdownElement): boolean;
	}
}
declare module 'api/reactive/ReactiveComponent' {
	import type { API } from 'api/API';
	import type { JsFunc } from 'engine/JsExecution';
	import type { ResultRenderer } from 'engine/ResultRenderer';
	/**
	 * A reactive component is a component that can be refreshed.
	 * This is useful for rendering dynamic content.
	 *
	 * See {@link API.reactive}
	 */
	export class ReactiveComponent {
		private readonly apiInstance;
		private readonly _render;
		private readonly initialArgs;
		/**
		 * @internal
		 */
		renderer: ResultRenderer | undefined;
		constructor(api: API, _render: JsFunc, initialArgs: unknown[]);
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
declare module 'engine/ResultRenderer' {
	import type JsEnginePlugin from 'main';
	import type { Component } from 'obsidian';
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
declare module 'api/Internal' {
	import type { API } from 'api/API';
	import type { EngineExecutionParams } from 'engine/Engine';
	import type { JsExecution, JsExecutionContext, JsExecutionGlobals, JsExecutionGlobalsConstructionOptions } from 'engine/JsExecution';
	import { ResultRenderer } from 'engine/ResultRenderer';
	import { Component } from 'obsidian';
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
		/**
		 * Lead and execute the given file.
		 * This method also handles the lifetime of the execution.
		 * The component for the execution is created and destroyed automatically.
		 *
		 * @param path
		 * @param params
		 */
		executeFileSimple(path: string, params?: Omit<EngineExecutionParams, 'code' | 'component'>): Promise<JsExecution>;
		/**
		 * Gets the execution context for a specific file, throws when the file does not exist.
		 *
		 * @param path
		 */
		getContextForFile(path: string): Promise<JsExecutionContext>;
		/**
		 * Creates execution globals.
		 *
		 * @param options
		 */
		createExecutionGlobals(options: JsExecutionGlobalsConstructionOptions): JsExecutionGlobals;
	}
}
declare module 'api/LibAPI' {
	import { Parser } from '@lemons_dev/parsinom/lib/Parser';
	import { ParserContext } from '@lemons_dev/parsinom/lib/ParserContext';
	import { createParsingErrorMessage, ParsingError } from '@lemons_dev/parsinom/lib/ParserError';
	import { P_UTILS } from '@lemons_dev/parsinom/lib/ParserUtils';
	import { P } from '@lemons_dev/parsinom/lib/ParsiNOM';
	import * as IterTools from 'itertools-ts';
	import type { API } from 'api/API';
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
declare module 'api/MarkdownAPI' {
	import type { API } from 'api/API';
	import {
		BlockQuoteElement,
		CalloutElement,
		CodeBlockElement,
		CodeElement,
		HeadingElement,
		ListElement,
		ParagraphElement,
		TableElement,
		TextElement,
	} from 'api/markdown/AbstractMarkdownElementContainer';
	import { MarkdownBuilder } from 'api/markdown/MarkdownBuilder';
	import { MarkdownString } from 'api/markdown/MarkdownString';
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
		 * Creates a new markdown text element with highlighted formatting.
		 *
		 * @param text
		 */
		createHighlightedText(text: string): TextElement;
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
		 * Creates a new markdown collapsible callout element.
		 *
		 * @param title the title of the callout
		 * @param type the type of the callout
		 * @param args the callout args, optional
		 * @param collapsed whether the callout should be collapsed by default, optional
		 */
		createCollapsibleCallout(title: string, type: string, args?: string, collapsed?: boolean): CalloutElement;
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
		/**
		 * Creates a new markdown list element.
		 *
		 * @param ordered whether the list should be ordered or not (use 1. or -), defaults to unordered
		 */
		createList(ordered?: boolean): ListElement;
		/**
		 * Creates a new ordered markdown list element.
		 */
		createOrderedList(): ListElement;
	}
}
declare module 'api/MessageAPI' {
	import type { API } from 'api/API';
	import type { MessageManager, MessageType, MessageWrapper } from 'messages/MessageManager';
	export class MessageAPI {
		readonly apiInstance: API;
		readonly messageManager: MessageManager;
		constructor(apiInstance: API);
		createMessage(type: MessageType, title: string, content: string, code?: string): MessageWrapper;
		getMessageById(id: string): MessageWrapper | undefined;
		getMessagesForInstance(): MessageWrapper[];
	}
}
declare module 'api/QueryAPI' {
	import type { API } from 'api/API';
	import type { CachedMetadata, TFile } from 'obsidian';
	export class QueryAPI {
		readonly apiInstance: API;
		constructor(apiInstance: API);
		/**
		 * This function will run the `query` callback on every markdown file in the vault and then return a list of the results, with `undefined` filtered out.
		 *
		 * @example
		 * ```typescript
		 * // Find all markdown `TFiles` that start with the word "Foo"
		 * const files = engine.query.files(file => file.name.startsWith("Foo") ? file : undefined);
		 * ```
		 *
		 * @example
		 * ```typescript
		 * // Find all the names of all markdown files that are in the "Foo" folder
		 * const fileNames = engine.query.files(file => file.path.startsWith("Foo/") ? file.name : undefined);
		 * ```
		 */
		files<T>(query: (file: TFile) => T | undefined): T[];
		/**
		 * This function functions similarly tp {@link QueryAPI.files}, but also provides the cache and tags of each file to the `query` callback.
		 *
		 * @example
		 * ```typescript
		 * // Find the paths of all markdown files that have the tag "Foo"
		 * const paths = engine.query.filesWithMetadata((file, cache, tags) => tags.includes("Foo") ? file.path : undefined);
		 * ```
		 */
		filesWithMetadata<T>(query: (file: TFile, cache: CachedMetadata | null, tags: string[]) => T | undefined): T[];
	}
}
declare module 'utils/Link' {
	import type { Parser } from '@lemons_dev/parsinom/lib/Parser';
	import type { App, TFile } from 'obsidian';
	export const P_FilePath: Parser<string>;
	export function isUrl(str: string): boolean;
	export class MarkdownLink {
		isEmbed: boolean;
		target: string;
		block?: string;
		alias?: string;
		internal: boolean;
		constructor(isEmbed: boolean, target: string, block?: string, alias?: string, internal?: boolean);
		static fromUrl(url: URL): MarkdownLink;
		static fromString(str: string): MarkdownLink | undefined;
		fullTarget(): string;
		toTFile(app: App, sourcePath: string): TFile | undefined;
	}
}
declare module 'api/API' {
	import type { InstanceId } from 'api/InstanceId';
	import { InternalAPI } from 'api/Internal';
	import { LibAPI } from 'api/LibAPI';
	import { MarkdownAPI } from 'api/MarkdownAPI';
	import { MessageAPI } from 'api/MessageAPI';
	import { PromptAPI } from 'api/PromptAPI';
	import { QueryAPI } from 'api/QueryAPI';
	import { ReactiveComponent } from 'api/reactive/ReactiveComponent';
	import type { JsFunc } from 'engine/JsExecution';
	import type JsEnginePlugin from 'main';
	import type { Validators } from 'utils/Validators';
	import type { App, Plugin, TFile } from 'obsidian';
	import * as Obsidian from 'obsidian';
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
		readonly validators: Validators;
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
		 * API to query your vault with simple javascript functions.
		 */
		readonly query: QueryAPI;
		readonly prompt: PromptAPI;
		/**
		 * API to interact with js engines internals.
		 */
		readonly internal: InternalAPI;
		constructor(app: App, plugin: JsEnginePlugin, instanceId: InstanceId);
		/**
		 * Loads an ECMAScript module from a vault relative path.
		 * Everything you import via this function will be loaded as an ECMAScript module.
		 *
		 * Since imports are cached by the browser (aka Obsidian),
		 * you might need to reload Obsidian to see changes made to the imported file.
		 *
		 * @param path the vault relative path of the file to import
		 */
		importJs(path: string): Promise<unknown>;
		/**
		 * Gets a plugin by its id. A plugin id can be found by looking at its manifest.
		 * If the plugin is not enabled, this will return undefined.
		 *
		 * @param pluginId the id of the plugin.
		 */
		getPlugin(pluginId: string): Plugin | undefined;
		/**
		 * Gets the obsidian module.
		 * This allows you to access all things exported by the obsidian module.
		 *
		 * @example
		 * ```js
		 * const obsidian = engine.getObsidianModule();
		 * new obsidian.Notice('Hello World!');
		 * ```
		 */
		getObsidianModule(): typeof Obsidian;
		/**
		 * Creates a reactive component.
		 * Reactive components are useful for creating dynamic content.
		 *
		 * @param fn the function to rerun. It's return value will be rendered.
		 * @param initialArgs the initial arguments (for the first render) to pass to the function.
		 */
		reactive(fn: JsFunc, ...initialArgs: unknown[]): ReactiveComponent;
		/**
		 * Gets the target file of a link.
		 * The link must be a valid wiki link with or without the brackets, so `[[file|foo]]` or `file|foo`.
		 * If the link is not found, this will return undefined.
		 *
		 * @param link the link to get the target file of.
		 * @param sourcePath the path of the file that contains the link. This is needed to resolve relative links.
		 */
		getLinkTarget(link: string, sourcePath: string): TFile | undefined;
	}
}
declare module 'engine/JsExecution' {
	import { API } from 'api/API';
	import type { EngineExecutionParams } from 'engine/Engine';
	import type JsEnginePlugin from 'main';
	import type { MessageWrapper } from 'messages/MessageManager';
	import type { App, CachedMetadata, Component, TFile } from 'obsidian';
	import type * as Obsidian from 'obsidian';
	/**
	 * An async JavaScript function.
	 */
	export type JsFunc = (...args: unknown[]) => Promise<unknown>;
	/**
	 * Context provided to a {@link JsExecution}.
	 */
	export interface JsExecutionContext {
		/**
		 * The file that the execution was triggered from.
		 */
		file?: TFile | undefined;
		/**
		 * The metadata of the file that the execution was triggered from.
		 */
		metadata?: CachedMetadata | undefined;
		/**
		 * Currently unused.
		 */
		block?: Block | undefined;
	}
	export interface Block {
		from: number;
		to: number;
	}
	/**
	 * Global variables provided to a {@link JsExecution}.
	 */
	export interface JsExecutionGlobals {
		/**
		 * Reference to the obsidian [app](https://docs.obsidian.md/Reference/TypeScript+API/App) (obsidian API).
		 */
		app: App;
		/**
		 * Reference to this plugins API.
		 */
		engine: API;
		/**
		 * Obsidian [component](https://docs.obsidian.md/Reference/TypeScript+API/Component) for lifecycle management.
		 */
		component: Component;
		/**
		 * The context provided. This can be undefined and extended by other properties.
		 */
		context: (JsExecutionContext | undefined) & Record<string, unknown>;
		/**
		 * The container element that the execution can render to. This can be undefined.
		 */
		container: HTMLElement | undefined;
		/**
		 * The entire obsidian module, e.g. a notice can be constructed like this: `new obsidian.Notice('Hello World')`.
		 */
		obsidian: typeof Obsidian;
	}
	/**
	 * Interface for constructing {@link JsExecutionGlobals}.
	 */
	export interface JsExecutionGlobalsConstructionOptions {
		/**
		 * Optional API instance.
		 * If not provided, the one from which the execution globals are constructed is used.
		 */
		engine?: API;
		/**
		 * Obsidian [component](https://docs.obsidian.md/Reference/TypeScript+API/Component) for lifecycle management.
		 */
		component: Component;
		/**
		 * The context provided. This can be undefined and extended by other properties.
		 */
		context: (JsExecutionContext | undefined) & Record<string, unknown>;
		/**
		 * The container element that the execution can render to. This can be undefined.
		 */
		container?: HTMLElement | undefined;
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
		private readonly context;
		private readonly apiInstance;
		private messages;
		private func;
		readonly globals: JsExecutionGlobals;
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
declare module 'JsMDRC' {
	import type { JsExecutionContext, JsExecution } from 'engine/JsExecution';
	import type JsEnginePlugin from 'main';
	import type { MarkdownPostProcessorContext } from 'obsidian';
	import { MarkdownRenderChild, TFile } from 'obsidian';
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
		onload(): void;
		onunload(): void;
	}
}
declare module 'index' {
	export * from 'engine/Engine';
	export * from 'engine/JsExecution';
	export * from 'engine/ResultRenderer';
	export * from 'api/API';
	export * from 'api/InstanceId';
	export * from 'api/Internal';
	export * from 'api/LibAPI';
	export * from 'api/MarkdownAPI';
	export * from 'api/MessageAPI';
	export * from 'api/PromptAPI';
	export * from 'api/QueryAPI';
	export * from 'api/reactive/ReactiveComponent';
	export * from 'api/markdown/AbstractMarkdownElement';
	export * from 'api/markdown/AbstractMarkdownElementContainer';
	export * from 'api/markdown/AbstractMarkdownLiteral';
	export * from 'api/markdown/MarkdownString';
	export * from 'api/markdown/MarkdownBuilder';
	export * from 'api/markdown/MarkdownElementType';
}
declare module 'utils/UseIcon' {
	export function useIcon(
		node: HTMLElement,
		icon: string,
	): {
		update: (icon: string) => void;
	};
}
