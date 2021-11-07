---
title: Typeof Type Operator
layout: docs
permalink: /docs/handbook/2/typeof-types.html
oneline: "Using the typeof operator in type contexts."
---

## The `typeof` type operator

JavaScript already has a `typeof` operator you can use in an _expression_ context:

已经有一个类型的操作符，你可以在表达式上下文中使用:

```ts twoslash
// Prints "string"
console.log(typeof "Hello world");
```

TypeScript adds a `typeof` operator you can use in a _type_ context to refer to the _type_ of a variable or property:

已经有一个类型的操作符，你可以在表达式上下文中使用:

```ts twoslash
let s = "hello";
let n: typeof s;
//  ^?
```

This isn't very useful for basic types, but combined with other type operators, you can use `typeof` to conveniently express many patterns.
For an example, let's start by looking at the predefined type `ReturnType<T>`.
It takes a _function type_ and produces its return type:

这对于基本类型并不十分有用，但是结合其他类型操作符，您可以使用 typeof 方便地表示许多模式。例如，让我们首先查看预定义的类型 ReturnType < t > 。它接受一个函数类型并生成它的返回类型:

```ts twoslash
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
//   ^?
```

If we try to use `ReturnType` on a function name, we see an instructive error:
如果我们尝试在函数名上使用 ReturnType，我们会看到一个指导性错误:


```ts twoslash
// @errors: 2749
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>;
```

Remember that _values_ and _types_ aren't the same thing.
To refer to the _type_ that the _value `f`_ has, we use `typeof`:
记住，值和类型不是一回事。为了引用值 f 的类型，我们使用 typeof:


```ts twoslash
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
//   ^?
```

### Limitations 局限

TypeScript intentionally limits the sorts of expressions you can use `typeof` on.
有意地限制了你可以使用 typeof on 的表达式的种类。


Specifically, it's only legal to use `typeof` on identifiers (i.e. variable names) or their properties.
This helps avoid the confusing trap of writing code you think is executing, but isn't:
具体来说，使用 typeof on 标识符(即变量名)或其属性是合法的。这有助于避免编写你认为正在执行但实际上并没有执行的代码时出现的困惑:
```ts twoslash
// @errors: 1005
declare const msgbox: () => boolean;
// type msgbox = any;
// ---cut---
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
```
