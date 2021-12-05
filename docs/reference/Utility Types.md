---
title: Utility Types
layout: docs
permalink: /docs/handbook/utility-types.html
oneline: Types which are globally included in TypeScript
translatable: true
---

TypeScript provides several utility types to facilitate common type transformations. These utilities are available globally.
TypeScript 提供了几种实用程序类型来促进常见的类型转换。


## `Partial<Type>`

<blockquote class=bg-reading>

Released:  
[2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

</blockquote>

Constructs a type with all properties of `Type` set to optional. This utility will return a type that represents all subsets of a given type.
构造具有 Type 的所有属性设置为可选的类型。此实用程序将返回表示给定类型的所有子集的类型。



##### Example

```ts twoslash
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```

## `Required<Type>`

<blockquote class=bg-reading>

Released:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#improved-control-over-mapped-type-modifiers)

</blockquote>

Constructs a type consisting of all properties of `Type` set to required. The opposite of [`Partial`](#partialtype).
构造一个包含 Type 设置为 required 的所有属性的类型。与 Partial 相反。


##### Example

```ts twoslash
// @errors: 2741
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

const obj2: Required<Props> = { a: 5 };
```

## `Readonly<Type>`

<blockquote class=bg-reading>

Released:  
[2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

</blockquote>

Constructs a type with all properties of `Type` set to `readonly`, meaning the properties of the constructed type cannot be reassigned.
构造具有 Type 的所有属性设置为只读的类型，这意味着不能重新分配构造类型的属性。



##### Example

```ts twoslash
// @errors: 2540
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};

todo.title = "Hello";
```

This utility is useful for representing assignment expressions that will fail at runtime (i.e. when attempting to reassign properties of a [frozen object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)).
此实用程序对于表示在运行时失败的赋值表达式(即试图重新分配冻结对象的属性时)非常有用。


##### `Object.freeze`

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
```

## `Record<Keys, Type>`

<blockquote class=bg-reading>

Released:  
[2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

</blockquote>

Constructs an object type whose property keys are `Keys` and whose property values are `Type`. This utility can be used to map the properties of a type to another type.
构造属性键为 Keys、属性值为 Type 的对象类型。此实用工具可用于将一个类型的属性映射到另一个类型。



##### Example

```ts twoslash
interface CatInfo {
  age: number;
  breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

cats.boris;
// ^?
```

## `Pick<Type, Keys>`

<blockquote class=bg-reading>

Released:  
[2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

</blockquote>

Constructs a type by picking the set of properties `Keys` (string literal or union of string literals) from `Type`.
通过从 Type 中选择一组属性 Keys (字符串文本或字符串文本的并集)来构造类型。


##### Example

```ts twoslash
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

todo;
// ^?
```

## `Omit<Type, Keys>`

<blockquote class=bg-reading>

Released:  
[3.5](/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type)

</blockquote>

Constructs a type by picking all properties from `Type` and then removing `Keys` (string literal or union of string literals).
通过从 Type 中选取所有属性，然后移除 Keys (字符串文字或字符串文字的并集)来构造类型。



##### Example

```ts twoslash
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};

todo;
// ^?

type TodoInfo = Omit<Todo, "completed" | "createdAt">;

const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
};

todoInfo;
// ^?
```

## `Exclude<Type, ExcludedUnion>`

<blockquote class=bg-reading>

Released:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

Constructs a type by excluding from `Type` all union members that are assignable to `ExcludedUnion`.
通过从类型中排除可分配给 ExcludedUnion 的所有联合成员来构造类型。



##### Example

```ts twoslash
type T0 = Exclude<"a" | "b" | "c", "a">;
//    ^?
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
//    ^?
type T2 = Exclude<string | number | (() => void), Function>;
//    ^?
```

## `Extract<Type, Union>`

<blockquote class=bg-reading>

Released:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

Constructs a type by extracting from `Type` all union members that are assignable to `Union`.
通过从 Type 中提取可分配给 Union 的所有联合成员来构造类型。



##### Example

```ts twoslash
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
//    ^?
type T1 = Extract<string | number | (() => void), Function>;
//    ^?
```

## `NonNullable<Type>`

<blockquote class=bg-reading>

Released:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

Constructs a type by excluding `null` and `undefined` from `Type`.
通过从 Type 中排除 null 和 undefined 来构造类型。



##### Example

```ts twoslash
type T0 = NonNullable<string | number | undefined>;
//    ^?
type T1 = NonNullable<string[] | null | undefined>;
//    ^?
```

## `Parameters<Type>`

<blockquote class=bg-reading>

Released:  
[3.1](https://github.com/microsoft/TypeScript/pull/26243)

</blockquote>

Constructs a tuple type from the types used in the parameters of a function type `Type`.
从函数类型类型的参数中使用的类型构造元组类型。



##### Example

```ts twoslash
// @errors: 2344
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>;
//    ^?
type T1 = Parameters<(s: string) => void>;
//    ^?
type T2 = Parameters<<T>(arg: T) => T>;
//    ^?
type T3 = Parameters<typeof f1>;
//    ^?
type T4 = Parameters<any>;
//    ^?
type T5 = Parameters<never>;
//    ^?
type T6 = Parameters<string>;
//    ^?
type T7 = Parameters<Function>;
//    ^?
```

## `ConstructorParameters<Type>`

<blockquote class=bg-reading>

Released:  
[3.1](https://github.com/microsoft/TypeScript/pull/26243)

</blockquote>

Constructs a tuple or array type from the types of a constructor function type. It produces a tuple type with all the parameter types (or the type `never` if `Type` is not a function).
从构造函数类型的类型构造元组或数组类型。它生成具有所有参数类型的元组类型(如果 Type 不是函数，则生成 never 类型)。



##### Example

```ts twoslash
// @errors: 2344
// @strict: false
type T0 = ConstructorParameters<ErrorConstructor>;
//    ^?
type T1 = ConstructorParameters<FunctionConstructor>;
//    ^?
type T2 = ConstructorParameters<RegExpConstructor>;
//    ^?
type T3 = ConstructorParameters<any>;
//    ^?

type T4 = ConstructorParameters<Function>;
//    ^?
```

## `ReturnType<Type>`

<blockquote class=bg-reading>

Released:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

Constructs a type consisting of the return type of function `Type`.
构造一个类型，包含函数 Type 的返回类型。



##### Example

```ts twoslash
// @errors: 2344 2344
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>;
//    ^?
type T1 = ReturnType<(s: string) => void>;
//    ^?
type T2 = ReturnType<<T>() => T>;
//    ^?
type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
//    ^?
type T4 = ReturnType<typeof f1>;
//    ^?
type T5 = ReturnType<any>;
//    ^?
type T6 = ReturnType<never>;
//    ^?
type T7 = ReturnType<string>;
//    ^?
type T8 = ReturnType<Function>;
//    ^?
```

## `InstanceType<Type>`

<blockquote class=bg-reading>

Released:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

Constructs a type consisting of the instance type of a constructor function in `Type`.
构造由 Type 中构造函数的实例类型组成的类型。



##### Example

```ts twoslash
// @errors: 2344 2344
// @strict: false
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;
//    ^?
type T1 = InstanceType<any>;
//    ^?
type T2 = InstanceType<never>;
//    ^?
type T3 = InstanceType<string>;
//    ^?
type T4 = InstanceType<Function>;
//    ^?
```

## `ThisParameterType<Type>`

<blockquote class=bg-reading>

Released:  
[3.3](https://github.com/microsoft/TypeScript/pull/28920)

</blockquote>

Extracts the type of the [this](/docs/handbook/functions.html#this-parameters) parameter for a function type, or [unknown](/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) if the function type has no `this` parameter.
提取函数类型的此参数的类型，如果函数类型没有此参数，则未知

##### Example

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

## `OmitThisParameter<Type>`

<blockquote class=bg-reading>

Released:  
[3.3](https://github.com/microsoft/TypeScript/pull/28920)

</blockquote>

Removes the [`this`](/docs/handbook/functions.html#this-parameters) parameter from `Type`. If `Type` has no explicitly declared `this` parameter, the result is simply `Type`. Otherwise, a new function type with no `this` parameter is created from `Type`. Generics are erased and only the last overload signature is propagated into the new function type.
从 Type 中移除此参数。如果 Type 没有显式声明此参数，则结果只是 Type。否则，将从 Type 创建没有此参数的新函数类型。泛型被擦除，只有最后一个重载签名被传播到新的函数类型中。


##### Example

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

console.log(fiveToHex());
```

## `ThisType<Type>`

<blockquote class=bg-reading>

Released:  
[2.3](https://github.com/microsoft/TypeScript/pull/14141)

</blockquote>

This utility does not return a transformed type. Instead, it serves as a marker for a contextual [`this`](/docs/handbook/functions.html#this) type. Note that the [`noImplicitThis`](/tsconfig#noImplicitThis) flag must be enabled to use this utility.
此实用程序不返回转换后的类型。相反，它可以作为这种类型上下文的标记。请注意，必须启用 noImplicitThis 标志才能使用此实用程序。



##### Example

```ts twoslash
// @noImplicitThis: false
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

In the example above, the `methods` object in the argument to `makeObject` has a contextual type that includes `ThisType<D & M>` and therefore the type of [this](/docs/handbook/functions.html#this) in methods within the `methods` object is `{ x: number, y: number } & { moveBy(dx: number, dy: number): number }`. Notice how the type of the `methods` property simultaneously is an inference target and a source for the `this` type in methods.
在上面的示例中，makeObject 参数中的方法对象具有上下文类型，包括 ThisType < d & m > ，因此方法对象中的方法类型是{ x: number，y: number } & { moveBy (dx: number，dy: number) : number }。请注意，方法属性的类型如何同时是方法中此类型的推断目标和源。

The `ThisType<T>` marker interface is simply an empty interface declared in `lib.d.ts`. Beyond being recognized in the contextual type of an object literal, the interface acts like any empty interface.
ThisType < t > 标记接口只是在 lib.d.ts 中声明的一个空接口。除了在对象文本的上下文类型中被识别之外，接口的作用就像任何空接口一样。




## Intrinsic String Manipulation Types 内部字符串操作类型

### `Uppercase<StringType>`

### `Lowercase<StringType>`

### `Capitalize<StringType>`

### `Uncapitalize<StringType>`

To help with string manipulation around template string literals, TypeScript includes a set of types which can be used in string manipulation within the type system. You can find those in the [Template Literal Types](/docs/handbook/2/template-literal-types.html#uppercasestringtype) documentation.
为了帮助处理模板字符串的字符串操作，TypeScript 包含了一组类型，可以用于类型系统中的字符串操作。您可以在 Template Literal Types 文档中找到它们。

