---
title: Type Inference
layout: docs
permalink: /docs/handbook/type-inference.html
oneline: How code flow analysis works in TypeScript
translatable: true
---

In TypeScript, there are several places where type inference is used to provide type information when there is no explicit type annotation. For example, in this code
在 TypeScript 中，有几个地方在没有显式类型注释时使用类型推断提供类型信息。例如，在这段代码中

```ts twoslash
let x = 3;
//  ^?
```

The type of the `x` variable is inferred to be `number`.
This kind of inference takes place when initializing variables and members, setting parameter default values, and determining function return types.
X 变量的类型被推断为 number。这种推断发生在初始化变量和成员、设置参数默认值和确定函数返回类型时。

In most cases, type inference is straightforward.
In the following sections, we'll explore some of the nuances in how types are inferred.
在大多数情况下，类型推断是直接的。在接下来的部分中，我们将探究类型推断方式中的一些细微差别。

## Best common type 最佳通用类型

When a type inference is made from several expressions, the types of those expressions are used to calculate a "best common type". For example,
当由多个表达式进行类型推断时，这些表达式的类型用于计算“最佳公共类型”。比如说,

```ts twoslash
let x = [0, 1, null];
//  ^?
```

To infer the type of `x` in the example above, we must consider the type of each array element.
Here we are given two choices for the type of the array: `number` and `null`.
The best common type algorithm considers each candidate type, and picks the type that is compatible with all the other candidates.
要在上面的例子中推断 x 的类型，我们必须考虑每个数组元素的类型。对于数组的类型，我们有两个选择: number 和 null。最佳通用类型算法考虑每个候选类型，并选择与所有其他候选类型兼容的类型。

Because the best common type has to be chosen from the provided candidate types, there are some cases where types share a common structure, but no one type is the super type of all candidate types. For example:
因为必须从提供的候选类型中选择最佳公共类型，所以在某些情况下，类型共享一个公共结构，但没有一个类型是所有候选类型的超类型。例如:

```ts twoslash
// @strict: false
class Animal {}
class Rhino extends Animal {
  hasHorn: true;
}
class Elephant extends Animal {
  hasTrunk: true;
}
class Snake extends Animal {
  hasLegs: false;
}
// ---cut---
let zoo = [new Rhino(), new Elephant(), new Snake()];
//    ^?
```

Ideally, we may want `zoo` to be inferred as an `Animal[]`, but because there is no object that is strictly of type `Animal` in the array, we make no inference about the array element type.
To correct this, instead explicitly provide the type when no one type is a super type of all other candidates:
理想情况下，我们可能希望 zoo 被推断为 Animal [] ，但是因为数组中没有严格属于 Animal 类型的对象，所以我们不会推断数组元素的类型。为了纠正这个错误，当没有一个类型是所有其他候选类型的超类型时，显式地提供类型:

```ts twoslash
// @strict: false
class Animal {}
class Rhino extends Animal {
  hasHorn: true;
}
class Elephant extends Animal {
  hasTrunk: true;
}
class Snake extends Animal {
  hasLegs: false;
}
// ---cut---
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
//    ^?
```

When no best common type is found, the resulting inference is the union array type, `(Rhino | Elephant | Snake)[]`.
如果没有找到最佳公共类型，则结果推断为联合数组类型(Rhino | Elephant | Snake)[]。

## Contextual Typing 上下文类型

Type inference also works in "the other direction" in some cases in TypeScript.
This is known as "contextual typing". Contextual typing occurs when the type of an expression is implied by its location. For example:
类型推断在打字脚本中的某些情况下也适用于“其他方向”。这就是所谓的“上下文类型”。当表达式的类型由其位置隐含时，就会发生上下文类型。例如:

```ts twoslash
// @errors: 2339
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button);
  console.log(mouseEvent.kangaroo);
};
```

Here, the TypeScript type checker used the type of the `Window.onmousedown` function to infer the type of the function expression on the right hand side of the assignment.
When it did so, it was able to infer the [type](https://developer.mozilla.org/docs/Web/API/MouseEvent) of the `mouseEvent` parameter, which does contain a `button` property, but not a `kangaroo` property.
这里，TypeScript 类型检查器使用 Window.onmousedown 函数的类型来推断赋值右侧的函数表达式的类型。这样做时，它能够推断 mouseEvent 参数的类型，该参数确实包含一个按钮属性，但不包含袋鼠属性。

This works because window already has `onmousedown` declared in its type:
这是因为窗口已经在其类型中声明了 onmousedown:

```ts
// Declares there is a global variable called 'window'
declare var window: Window & typeof globalThis;

// Which is declared as (simplified):
interface Window extends GlobalEventHandlers {
  // ...
}

// Which defines a lot of known handler events
interface GlobalEventHandlers {
  onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  // ...
}
```

TypeScript is smart enough to infer types in other contexts as well:
很聪明，能够推断出其他上下文中的类型:

```ts twoslash
// @errors: 2339
window.onscroll = function (uiEvent) {
  console.log(uiEvent.button);
};
```

Based on the fact that the above function is being assigned to `Window.onscroll`, TypeScript knows that `uiEvent` is a [UIEvent](https://developer.mozilla.org/docs/Web/API/UIEvent), and not a [MouseEvent](https://developer.mozilla.org/docs/Web/API/MouseEvent) like the previous example. `UIEvent` objects contain no `button` property, and so TypeScript will throw an error.
基于上面的函数被分配给 Window.onscroll 这一事实，打字稿知道 uilevent 是一个 uilevent，而不是像前面的示例那样的 MouseEvent。对象不包含按钮属性，因此 TypeScript 将抛出一个错误。

If this function were not in a contextually typed position, the function's argument would implicitly have type `any`, and no error would be issued (unless you are using the [`noImplicitAny`](/tsconfig#noImplicitAny) option):
如果这个函数不在上下文类型的位置，函数的参数将隐式地具有任何类型，并且不会发出任何错误(除非您使用 noImplicitAny 选项) :

```ts twoslash
// @noImplicitAny: false
const handler = function (uiEvent) {
  console.log(uiEvent.button); // <- OK
};
```

We can also explicitly give type information to the function's argument to override any contextual type:
我们也可以显式地为函数的参数提供类型信息，以覆盖任何上下文类型:

```ts twoslash
window.onscroll = function (uiEvent: any) {
  console.log(uiEvent.button); // <- Now, no error is given
};
```

However, this code will log `undefined`, since `uiEvent` has no property called `button`.
但是，此代码将记录未定义的内容，因为 uiEvent 没有名为 button 的属性。

Contextual typing applies in many cases.
Common cases include arguments to function calls, right hand sides of assignments, type assertions, members of object and array literals, and return statements.
The contextual type also acts as a candidate type in best common type. For example:
上下文类型在许多情况下都适用。常见的情况包括函数调用的参数、赋值的右边、类型断言、对象和数组文字的成员以及返回语句。上下文类型还充当最佳通用类型中的候选类型。例如:

```ts twoslash
// @strict: false
class Animal {}
class Rhino extends Animal {
  hasHorn: true;
}
class Elephant extends Animal {
  hasTrunk: true;
}
class Snake extends Animal {
  hasLegs: false;
}
// ---cut---
function createZoo(): Animal[] {
  return [new Rhino(), new Elephant(), new Snake()];
}
```

In this example, best common type has a set of four candidates: `Animal`, `Rhino`, `Elephant`, and `Snake`.
Of these, `Animal` can be chosen by the best common type algorithm.
在本例中，最佳通用类型有一组四个候选类型: Animal、 Rhino、 Elephant 和 Snake。其中，动物可以选择最好的通用类型算法。
