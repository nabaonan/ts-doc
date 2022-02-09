---
title: The Basics
layout: docs
permalink: /docs/handbook/2/basic-types.html
oneline: "Step one in learning TypeScript: The basic types."
preamble: >
  <p>Welcome to the first page of the handbook. If this is your first experience with TypeScript - you may want to start at one of the '<a href='https://www.typescriptlang.org/docs/handbook/intro.html#get-started'>Getting Started</a>' guides</a>
---

Each and every value in JavaScript has a set of behaviors you can observe from running different operations.

JavaScript 中的每个值都有一组行为，您可以通过运行不同的操作来观察它们。

That sounds abstract, but as a quick example, consider some operations we might run on a variable named `message`.

这听起来很抽象，但是作为一个简单的例子，考虑一下我们可能在一个名为 `message` 的变量上运行的一些操作。


```js
// Accessing the property 'toLowerCase'
// on 'message' and then calling it
message.toLowerCase();

// Calling 'message'
message();
```

If we break this down, the first runnable line of code accesses a property called `toLowerCase` and then calls it.
The second one tries to call `message` directly.

如果我们分解它，第一行可运行的代码访问一个名为 `toLowerCase` 的属性，然后调用它。
第二行试图直接调用`message`。

But assuming we don't know the value of `message` - and that's pretty common - we can't reliably say what results we'll get from trying to run any of this code.
The behavior of each operation depends entirely on what value we had in the first place.

但是假设我们不知道`message`的值——这是很常见的——我们不确定说我们试图运行这些代码会得到什么结果。
每个操作的行为完全取决于我们最初拥有的值。

- Is `message` callable?

- Does it have a property called `toLowerCase` on it?

- If it does, is `toLowerCase` even callable?

- If both of these values are callable, what do they return?

  


- `message`是否可调用

- 他是否有一个叫`toLowerCase`的属性？

- 如果他有， `toLowerCase`是否可以被调用？

- 如果这些值都可以被调用，他们将返回什么？

  

The answers to these questions are usually things we keep in our heads when we write JavaScript, and we have to hope we got all the details right.

这些问题的答案通常是我们在编写 JavaScript 时脑子里的东西，我们必须希望所有的细节都是正确的。

Let's say `message` was defined in the following way.

假设`message`是以下面的方式定义的。

```js
const message = "Hello World!";
```

As you can probably guess, if we try to run `message.toLowerCase()`, we'll get the same string only in lower-case.

正如您可能猜到的那样，如果我们尝试运行  `message.toLowerCase()`,我们只会得到相同的小写字符串。

What about that second line of code?
If you're familiar with JavaScript, you'll know this fails with an exception:

第二行代码怎么样呢？
如果你熟悉 JavaScript，你会知道第二行代码抛出一个异常:

```txt
TypeError: message is not a function
```

It'd be great if we could avoid mistakes like this.
如果我们能避免这样的错误就好了。

When we run our code, the way that our JavaScript runtime chooses what to do is by figuring out the _type_ of the value - what sorts of behaviors and capabilities it has.
That's part of what that `TypeError` is alluding to - it's saying that the string `"Hello World!"` cannot be called as a function.

当我们运行我们的代码时，我们的 JavaScript 运行时通过选择可以做什么取决于值的类型——它具有哪些类型的行为和功能。
这就是  `TypeError` 所影射的部分内容——它说的是字符串 `"Hello World!"`不能作为函数来调用。

For some values, such as the primitives `string` and `number`, we can identify their type at runtime using the `typeof` operator.
But for other things like functions, there's no corresponding runtime mechanism to identify their types.
For example, consider this function:

对于某些值，例如原始类型的字符串和数字，我们可以在运行时使用 `typeof` 操作符识别它们的类型。
但是对于其他的比如函数，没有相应的运行时机制来识别它们的类型。
例如，考虑这个函数:

```js
function fn(x) {
  return x.flip();
}
```

We can _observe_ by reading the code that this function will only work if given an object with a callable `flip` property, but JavaScript doesn't surface this information in a way that we can check while the code is running.
The only way in pure JavaScript to tell what `fn` does with a particular value is to call it and see what happens.
This kind of behavior makes it hard to predict what code will do before it runs, which means it's harder to know what your code is going to do while you're writing it.

我们可以通过阅读代码来观察这个函数只有在给定一个具有可调用的 `flip` 属性的对象时才能正常工作，但是 JavaScript 并没有以一种我们可以在代码运行时检查的方式显示这些信息。
在纯 JavaScript 中，要知道`fn` 对特定值做了什么，唯一的方法就是调用它，然后看看会发生什么。
这种行为使得很难预测代码在运行之前会做什么，这意味着在编写代码时很难知道代码要做什么。

Seen in this way, a _type_ is the concept of describing which values can be passed to `fn` and which will crash.
JavaScript only truly provides _dynamic_ typing - running the code to see what happens.

这样看来，类型就是这样一个概念: 描述哪些值可以传递给 `fn`，哪些值会崩溃。JavaScript 只真正提供了动态类型——运行代码看看会发生什么。

The alternative is to use a _static_ type system to make predictions about what code is expected _before_ it runs.

另一种方法是使用静态类型系统来预测在运行代码之前需要什么代码。

## Static type-checking 静态类型检查

Think back to that `TypeError` we got earlier from trying to call a `string` as a function.
_Most people_ don't like to get any sorts of errors when running their code - those are considered bugs!
And when we write new code, we try our best to avoid introducing new bugs.

回想一下我们前面试图调用一个字符串作为一个函数时得到的 `TypeError`。大多数人不喜欢在运行代码时出现任何类型的错误——这些都被认为是 bug！当我们编写新的代码时，我们尽最大努力避免引入新的错误。

If we add just a bit of code, save our file, re-run the code, and immediately see the error, we might be able to isolate the problem quickly; but that's not always the case.
We might not have tested the feature thoroughly enough, so we might never actually run into a potential error that would be thrown!
Or if we were lucky enough to witness the error, we might have ended up doing large refactorings and adding a lot of different code that we're forced to dig through.

如果我们只添加一点代码，保存文件，重新运行代码，并立即看到错误，我们可能能够快速隔离问题; 但情况并非总是如此。我们可能没有充分地测试这个特性，所以我们可能永远不会遇到一个可能会抛出的潜在错误！
或者，如果我们足够幸运地目睹了这个错误，我们可能最终会执行大型重构，并添加许多不同的代码，导致我们必须深入研究的。

Ideally, we could have a tool that helps us find these bugs _before_ our code runs.
That's what a static type-checker like TypeScript does.
_Static types systems_ describe the shapes and behaviors of what our values will be when we run our programs.
A type-checker like TypeScript uses that information and tells us when things might be going off the rails.

理想情况下，我们可以有一个工具来帮助我们在代码运行之前找到这些bug。
这就像是TypeScript静态类型检查所做的工作。
静态类型系统描述了当我们运行程序时我们的值的形状和行为是什么样。
就像TypeScript的类型检查器使用这些信息，并告诉我们什么时候可能会出问题。

```ts twoslash
// @errors: 2349
const message = "hello!";

message();
```

Running that last sample with TypeScript will give us an error message before we run the code in the first place.

运行最后一个示例 TypeScript会在我们运行代码之前给我们一个错误消息。

## Non-exception Failures 无例外故障

So far we've been discussing certain things like runtime errors - cases where the JavaScript runtime tells us that it thinks something is nonsensical.
Those cases come up because [the ECMAScript specification](https://tc39.github.io/ecma262/) has explicit instructions on how the language should behave when it runs into something unexpected.

到目前为止，我们一直在讨论某些事情，比如运行时错误——在这种情况下，JavaScript 运行时会告诉我们，它认为某些事情是无意义的。
之所以会出现这些情况，是因为  [ECMAScript 规范](https://tc39.github.io/ecma262/) 明确指出，当运行出现异常时，该语言应该表现什么行为。

For example, the specification says that trying to call something that isn't callable should throw an error.
Maybe that sounds like "obvious behavior", but you could imagine that accessing a property that doesn't exist on an object should throw an error too.
Instead, JavaScript gives us different behavior and returns the value `undefined`:

例如，规范说，试图调用不可调用的东西应该抛出错误。
也许这听起来像是“显而易见的行为”，但是您可以想象，访问对象上不存在的属性也应该抛出错误。
相反，JavaScript 给了我们不同的行为并返回`undefined`值:

```js
const user = {
  name: "Daniel",
  age: 26,
};

user.location; // returns undefined
```

Ultimately, a static type system has to make the call over what code should be flagged as an error in its system, even if it's "valid" JavaScript that won't immediately throw an error.
In TypeScript, the following code produces an error about `location` not being defined:

最终，静态类型系统必须通过他内部系统在调用的代码上标记错误信息，即使它是“有效的”JavaScript，不会立即抛出错误。
在 TypeScript 中，下面的代码会产生一个关于未定义位置的错误:

```ts twoslash
// @errors: 2339
const user = {
  name: "Daniel",
  age: 26,
};

user.location;
```

While sometimes that implies a trade-off in what you can express, the intent is to catch legitimate bugs in our programs.
And TypeScript catches _a lot_ of legitimate bugs.

虽然有时候这意味着在你能表达的东西上有所取舍，但目的是在我们的程序中捕捉常规的 bug。
而且TypeScript捕捉了很多常规的漏洞。

For example: typos,

例如：拼写错误

```ts twoslash
// @noErrors
const announcement = "Hello World!";

// How quickly can you spot the typos?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();

// We probably meant to write this...
announcement.toLocaleLowerCase();
```

uncalled functions,

未正确调用函数

```ts twoslash
// @noUnusedLocals
// @errors: 2365
function flipCoin() {
  // Meant to be Math.random()
  return Math.random < 0.5;
}
```

or basic logic errors.

或者基本逻辑错误

```ts twoslash
// @errors: 2367
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
  // ...
} else if (value === "b") {
  // Oops, unreachable
}
```

## Types for Tooling     类型工具

TypeScript can catch bugs when we make mistakes in our code.
That's great, but TypeScript can _also_ prevent us from making those mistakes in the first place.

当我们在代码中出错时，TypeScript可以捕捉 bug。这很不错，但是TypeScript也可以在第一时间阻止我们犯这些错误。

The type-checker has information to check things like whether we're accessing the right properties on variables and other properties.
Once it has that information, it can also start _suggesting_ which properties you might want to use.

类型检查器有信息来检查我们是否正确访问变量和其他属性的属性。
一旦它有了这些信息，它还可以开始建议您可能想要使用哪些属性。

That means TypeScript can be leveraged for editing code too, and the core type-checker can provide error messages and code completion as you type in the editor.
That's part of what people often refer to when they talk about tooling in TypeScript.

这意味着也可以利用 TypeScript 编辑代码，并且当您在编辑器中键入时，核心类型检查器可以提供错误消息和代码补全。
这是人们在讨论TypeScript的作用时经常提到的一部分。


<!-- prettier-ignore -->
```ts twoslash
// @noErrors
// @esModuleInterop
import express from "express";
const app = express();

app.get("/", function (req, res) {
  res.sen
//       ^|
});

app.listen(3000);
```

TypeScript takes tooling seriously, and that goes beyond completions and errors as you type.
An editor that supports TypeScript can deliver "quick fixes" to automatically fix errors, refactorings to easily re-organize code, and useful navigation features for jumping to definitions of a variable, or finding all references to a given variable.
All of this is built on top of the type-checker and is fully cross-platform, so it's likely that [your favorite editor has TypeScript support available](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support).

TypeScript非常重视工具，而且在输入时不仅仅是补全和错误提示。一个支持TypeScript的编辑器可以提供“快速修复”来自动修复错误，重构代码以方便地重新组织代码，以及有用的导航功能，通过一个变量跳转到目标文件，或查找给定变量的所有引用。
所有这些都构建在类型检查器之上，并且是完全跨平台的， [您喜欢的编辑器已经支持TypeScript了](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support).
## `tsc`, the TypeScript compiler    `tsc` TypeScript编译器

We've been talking about type-checking, but we haven't yet used our type-_checker_.
Let's get acquainted with our new friend `tsc`, the TypeScript compiler.
First we'll need to grab it via npm.

我们一直在讨论类型检查，但还没有使用我们的类型检查器。
让我们来了解一下我们的新朋友 tsc，编译器。
首先，我们需要通过 npm 获取它。

```sh
npm install -g typescript
```

> This installs the TypeScript Compiler `tsc` globally.
> You can use `npx` or similar tools if you'd prefer to run `tsc` from a local `node_modules` package instead.

Now let's move to an empty folder and try writing our first TypeScript program: `hello.ts`:

现在让我们移动到一个空文件夹，尝试编写我们的第一个TypeScript程序:`hello.ts`:

```ts twoslash
// Greets the world.
console.log("Hello world!");
```

Notice there are no frills here; this "hello world" program looks identical to what you'd write for a "hello world" program in JavaScript.
And now let's type-check it by running the command `tsc` which was installed for us by the `typescript` package.

注意，这里没有虚饰; 这个“ hello world”程序看起来与用 JavaScript 编写的“ hello world”程序一模一样。
现在让我们通过运行安装过的`typescript` 包提供的命令`tsc` 来检查它。

```sh
tsc hello.ts
```

Tada!
嗒嗒！

Wait, "tada" _what_ exactly?
We ran `tsc` and nothing happened!
Well, there were no type errors, so we didn't get any output in our console since there was nothing to report.

等等，“嗒嗒”到底是什么？
我们运行了 tsc，什么都没发生！
很好，没有类型错误，所以我们没有得到任何输出在我们的控制台，因为没有什么要报告。


But check again - we got some _file_ output instead.
If we look in our current directory, we'll see a `hello.js` file next to `hello.ts`.
That's the output from our `hello.ts` file after `tsc` _compiles_ or _transforms_ it into a plain JavaScript file.
And if we check the contents, we'll see what TypeScript spits out after it processes a `.ts` file:

但再次检查-我们得到了一些替换过的输出文件。
如果我们查看我们的当前目录，我们会看到一个  `hello.js`文件在`hello.ts` 旁边。
这是 `hello.ts` 文件在 `tsc`  编译或转换他到一个纯 JavaScript 文件之后的输出。
如果我们检查内容，我们会看到TypeScript在处理了`.ts`文件后生成的。
```js
// Greets the world.
console.log("Hello world!");
```

In this case, there was very little for TypeScript to transform, so it looks identical to what we wrote.
The compiler tries to emit clean readable code that looks like something a person would write.
While that's not always so easy, TypeScript indents consistently, is mindful of when our code spans across different lines of code, and tries to keep comments around.

在这种情况下，几乎没有什么需要TypeScript转换的地方，所以它看起来和我们写的一模一样。
编译器试图生成清晰可读的代码，这些代码看起来像是人们编写的代码。
虽然这并不总是那么容易，但是 TypeScript 始终如一地缩进，考虑到当我们的代码跨越不同代码行时，并尽量保证注释环绕在四周。

What about if we _did_ introduce a type-checking error?
Let's rewrite `hello.ts`:

如果我们引入了一个类型检查错误呢?
让我们重写`hello.ts`:

```ts twoslash
// @noErrors
// This is an industrial-grade general-purpose greeter function:
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

greet("Brendan");
```

If we run `tsc hello.ts` again, notice that we get an error on the command line!

如果我们再次运行 `tsc hello.ts`，请注意，我们在命令行上得到一个错误！

```txt
Expected 2 arguments, but got 1.
```

TypeScript is telling us we forgot to pass an argument to the `greet` function, and rightfully so.
So far we've only written standard JavaScript, and yet type-checking was still able to find problems with our code.
Thanks TypeScript!

TypeScript告诉我们忘了给 `greet` 函数传递一个参数，这是正确的。
到目前为止，我们只编写了标准的 JavaScript，但类型检查仍然能够发现代码中的问题。
谢谢TypeScript！

## Emitting with Errors  发出错误

One thing you might not have noticed from the last example was that our `hello.js` file changed again.
If we open that file up then we'll see that the contents still basically look the same as our input file.
That might be a bit surprising given the fact that `tsc` reported an error about our code, but this is based on one of TypeScript's core values: much of the time, _you_ will know better than TypeScript.

在上一个示例中，您可能没有注意到的一件事是 `hello.js` 文件又变了。
如果我们打开这个文件，我们会看到它的内容看起来基本上和我们的输入文件一样。
这可能有点令人惊讶的是  `tsc`报告了一个关于我们代码的错误，但这是基于TypeScript的核心价值之一: 大多数时候，你会比TypeScript更清楚。

To reiterate from earlier, type-checking code limits the sorts of programs you can run, and so there's a tradeoff on what sorts of things a type-checker finds acceptable.
Most of the time that's okay, but there are scenarios where those checks get in the way.
For example, imagine yourself migrating JavaScript code over to TypeScript and introducing type-checking errors.
Eventually you'll get around to cleaning things up for the type-checker, but that original JavaScript code was already working!
Why should converting it over to TypeScript stop you from running it?

为了重申以前的观点，代码类型检查限制了可以运行的程序类型，因此类型检查器可以权衡哪些类型可以被接受。
在大多数情况下，这是可以的，但是在某些情况下，检查会成为障碍。
例如，想象自己将 JavaScript 代码迁移到 TypeScript 并引入类型检查错误。
最终，您将抽出时间为类型检查器清理东西，但是原始的 JavaScript 代码已经正常工作了！
为什么把它转换成TypeScript就不能运行了呢？

So TypeScript doesn't get in your way.
Of course, over time, you may want to be a bit more defensive against mistakes, and make TypeScript act a bit more strictly.
In that case, you can use the [`noEmitOnError`](/tsconfig#noEmitOnError) compiler option.
Try changing your `hello.ts` file and running `tsc` with that flag:

所以TypeScript不会成为你的阻碍。
当然，随着时间的推移，你可能需要对错误采取更多的防御措施，并使TypeScript更加严格。
在这种情况下，您可以使用 [`noEmitOnError`](/tsconfig#noEmitOnError) 编译器选项。
尝试更改 `hello.ts` 文件并使用该标志运行`tsc` :

```sh
tsc --noEmitOnError hello.ts
```

You'll notice that `hello.js` never gets updated.

您会发现 `hello.js` 不会被更新。

## Explicit Types    显示类型

Up until now, we haven't told TypeScript what `person` or `date` are.
Let's edit the code to tell TypeScript that `person` is a `string`, and that `date` should be a `Date` object.
We'll also use the `toDateString()` method on `date`.

到目前为止，我们还没有告诉TypeScript`person` 或 `date`是什么。
让我们编辑代码，告诉 TypeScript  `person` 是 `string`，`date`应该是一个`Date` 对象。
我们将在`date`上使用 `toDateString()`方法。

```ts twoslash
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

What we did was add _type annotations_ on `person` and `date` to describe what types of values `greet` can be called with.
You can read that signature as "`greet` takes a `person` of type `string`, and a `date` of type `Date`".

我们所做的就是在  `person` 和`date`上添加类型注释来描述能被`greet`调用的值的类型都是什么。
你可以认为`greet`的签名就是拥有 `string`类型的 `person`和一个`Date`类型的`date`。

With this, TypeScript can tell us about other cases where `greet` might have been called incorrectly.
For example...

有了这个，TypeScript可以告诉我们哪些情况`greet` 可能被错误调用。

```ts twoslash
// @errors: 2345
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", Date());
```

Huh?
TypeScript reported an error on our second argument, but why?

嗯? TypeScript在我们第二个参数上报了一个错误，但是为什么呢？

Perhaps surprisingly, calling `Date()` in JavaScript returns a `string`.
On the other hand, constructing a `Date` with `new Date()` actually gives us what we were expecting.

也许令人惊讶的是，在 JavaScript 中调用`Date()`返回一个 `string`类型。
另一方面，通过`new Date()`构造一个 `Date`类型 才会返回我们所期望的对象。

Anyway, we can quickly fix up the error:

无论如何，我们可以快速修复这个错误:

```ts twoslash {4}
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

Keep in mind, we don't always have to write explicit type annotations.
In many cases, TypeScript can even just _infer_ (or "figure out") the types for us even if we omit them.

请记住，我们并不总是需要编写明确的类型声明。
在许多情况下，即使我们省略了类型，TypeScript 甚至可以为我们推断(或者“搞明白”)类型。

```ts twoslash
let msg = "hello there!";
//  ^?
```

Even though we didn't tell TypeScript that `msg` had the type `string` it was able to figure that out.
That's a feature, and it's best not to add annotations when the type system would end up inferring the same type anyway.

尽管我们没有告诉TypeScript `msg`  是`string`类型，但是它能够推断出来。
这是一个特性，当类型系统最终推断出相同的类型时，最好不要添加声明。

> Note: the message bubble inside the code sample above. That is what your editor would show if you had hovered over the word.
> 注意: 代码上将会有气泡信息。就好像当你划过一个字符你的编辑器将会显示信息一样。

## Erased Types

Let's take a look at what happens when we compile the above function `greet` with `tsc` to output JavaScript:

```ts twoslash
// @showEmit
// @target: es5
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

Notice two things here:

1. Our `person` and `date` parameters no longer have type annotations.
2. Our "template string" - that string that used backticks (the `` ` `` character) - was converted to plain strings with concatenations (`+`).

More on that second point later, but let's now focus on that first point.
Type annotations aren't part of JavaScript (or ECMAScript to be pedantic), so there really aren't any browsers or other runtimes that can just run TypeScript unmodified.
That's why TypeScript needs a compiler in the first place - it needs some way to strip out or transform any TypeScript-specific code so that you can run it.
Most TypeScript-specific code gets erased away, and likewise, here our type annotations were completely erased.

> **Remember**: Type annotations never change the runtime behavior of your program.

## Downleveling

One other difference from the above was that our template string was rewritten from

```js
`Hello ${person}, today is ${date.toDateString()}!`;
```

to

```js
"Hello " + person + ", today is " + date.toDateString() + "!";
```

Why did this happen?

Template strings are a feature from a version of ECMAScript called ECMAScript 2015 (a.k.a. ECMAScript 6, ES2015, ES6, etc. - _don't ask_).
TypeScript has the ability to rewrite code from newer versions of ECMAScript to older ones such as ECMAScript 3 or ECMAScript 5 (a.k.a. ES3 and ES5).
This process of moving from a newer or "higher" version of ECMAScript down to an older or "lower" one is sometimes called _downleveling_.

By default TypeScript targets ES3, an extremely old version of ECMAScript.
We could have chosen something a little bit more recent by using the [`target`](/tsconfig#target) option.
Running with `--target es2015` changes TypeScript to target ECMAScript 2015, meaning code should be able to run wherever ECMAScript 2015 is supported.
So running `tsc --target es2015 hello.ts` gives us the following output:

```js
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
```

> While the default target is ES3, the great majority of current browsers support ES2015.
> Most developers can therefore safely specify ES2015 or above as a target, unless compatibility with certain ancient browsers is important.

## Strictness

Different users come to TypeScript looking for different things in a type-checker.
Some people are looking for a more loose opt-in experience which can help validate only some parts of their program, and still have decent tooling.
This is the default experience with TypeScript, where types are optional, inference takes the most lenient types, and there's no checking for potentially `null`/`undefined` values.
Much like how `tsc` emits in the face of errors, these defaults are put in place to stay out of your way.
If you're migrating existing JavaScript, that might be a desirable first step.

In contrast, a lot of users prefer to have TypeScript validate as much as it can straight away, and that's why the language provides strictness settings as well.
These strictness settings turn static type-checking from a switch (either your code is checked or not) into something closer to a dial.
The further you turn this dial up, the more TypeScript will check for you.
This can require a little extra work, but generally speaking it pays for itself in the long run, and enables more thorough checks and more accurate tooling.
When possible, a new codebase should always turn these strictness checks on.

TypeScript has several type-checking strictness flags that can be turned on or off, and all of our examples will be written with all of them enabled unless otherwise stated.
The [`strict`](/tsconfig#strict) flag in the CLI, or `"strict": true` in a [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) toggles them all on simultaneously, but we can opt out of them individually.
The two biggest ones you should know about are [`noImplicitAny`](/tsconfig#noImplicitAny) and [`strictNullChecks`](/tsconfig#strictNullChecks).

## `noImplicitAny`

Recall that in some places, TypeScript doesn't try to infer types for us and instead falls back to the most lenient type: `any`.
This isn't the worst thing that can happen - after all, falling back to `any` is just the plain JavaScript experience anyway.

However, using `any` often defeats the purpose of using TypeScript in the first place.
The more typed your program is, the more validation and tooling you'll get, meaning you'll run into fewer bugs as you code.
Turning on the [`noImplicitAny`](/tsconfig#noImplicitAny) flag will issue an error on any variables whose type is implicitly inferred as `any`.

## `strictNullChecks`

By default, values like `null` and `undefined` are assignable to any other type.
This can make writing some code easier, but forgetting to handle `null` and `undefined` is the cause of countless bugs in the world - some consider it a [billion dollar mistake](https://www.youtube.com/watch?v=ybrQvs4x0Ps)!
The [`strictNullChecks`](/tsconfig#strictNullChecks) flag makes handling `null` and `undefined` more explicit, and _spares_ us from worrying about whether we _forgot_ to handle `null` and `undefined`.
