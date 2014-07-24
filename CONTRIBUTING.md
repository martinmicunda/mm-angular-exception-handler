# Contributing

 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)
 - [Coding Rules](#rules)
 - [Commit Message Guidelines](#commit)

## <a name="issue"></a> Found an Issue?
If you find a bug in the source code or a mistake in the documentation, you can help us by
submitting an issue to our [GitHub Repository][github]. Even better you can submit a Pull Request
with a fix.

**Please see the [Submission Guidelines](#submit) below**.

## <a name="feature"></a> Want a Feature?
You can request a new feature by submitting an issue to our [GitHub Repository][github].  If you
would like to implement a new feature then consider what kind of change it is:

* **Major Changes** that you wish to contribute to the project should be discussed first by send us an email so that we can better coordinate our efforts, prevent
duplication of work, and help you to craft the change so that it is successfully accepted into the
project.
* **Small Changes** can be crafted and submitted to the [GitHub Repository][github] as a Pull Request.

## <a name="docs"></a> Want a Doc Fix?
If you want to help improve the docs just submitting an issue to our [GitHub Repository][github].

## <a name="notes"></a> Important Notes
Please don't edit files in the `dist` subdirectory as they are generated via gulp. You'll find source code in the `src` subdirectory!

## <a name="submit"></a> Submission Guidelines

### Submitting an Issues
Any bug-related issue should come with a reproducible test-case, using the ([Plunker](http://plnkr.co/) or
  [JSFiddle](http://jsfiddle.net/)) links in the docs to easily create one.

### Submitting a Pull Request

Before you submit your pull request consider the following guidelines:

* Search [GitHub][pulls] for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* Make your changes in a new git branch

  ```shell
  git checkout -b my-fix-branch master
  ```

* Create your patch, including appropriate test cases.
* Follow our [Coding Rules](#coding-rules)
* Commit your changes and create a descriptive commit message (the
  commit message is used to generate release notes, please check out our
  [commit message conventions](#commit-message-format) and our commit message presubmit hook
  `validate-commit-msg.js`):

   ```shell
   git commit -a
   ```

* Build your changes locally to ensure all the tests pass

  ```shell
  gulp test
  ```

* Push your branch to Github:

  ```shell
  git push origin my-fix-branch
  ```

* In Github, send a pull request to `mm-angular-logger:master`.
* If we suggest changes then you can modify your branch, rebase and force a new push to your GitHub
  repository to update the Pull Request:

  ```shell
  git rebase master -i
  git push -f
  ```

That's it! Thank you for your contribution!

When the patch is reviewed and merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

* Delete the remote branch on Github:

    ```shell
    git push origin --delete my-fix-branch
    ```

* Check out the master branch:

    ```shell
    git checkout master -f
    ```

* Delete the local branch:

    ```shell
    git branch -D my-fix-branch
    ```

* Update your master with the latest upstream version:

    ```shell
    git pull --ff upstream master
    ```

## <a name="rules"></a> Coding Rules
* All features or bug fixes **must be tested** by one or more [specs][unit-testing].
* All public API methods **must be documented** with ngdoc, an extended version of jsdoc (we added
  support for markdown and templating via @ngdoc tag). To see how we document our APIs, please check
  out the existing ngdocs and see [this wiki page][ngDocs].
* Regarding code style like indentation and whitespace, **follow the conventions you see used in the source already.**

## Modifying the code
First, ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

Test that gulp's CLI and Bower are installed by running `gulp --version` and `bower --version`.  If the commands aren't found, run `npm install -g gulp bower`.  For more information about installing the tools, see the [getting started with gulp guide](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) or [bower.io](http://bower.io/) respectively.

1. Fork and clone the repo.
1. Run `npm install` to install all build dependencies (including gulp).
1. Run `gulp install` to install the front-end dependencies.
1. Run `gulp serve` to run demo app so you play arround with this project source code.
1. Run `gulp test` to test this project.

Assuming that you don't see any red, you're ready to go. Just be sure to run `gulp test` after making any changes, to ensure that nothing is broken.

## <a name="commit"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the project change log**.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on github as well as in various git tools.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope
The scope could be anything specifying place of the commit change. For example `$location`,
`$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView`, etc...

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

###Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes"
The body should include the motivation for the change and contrast this with previous behavior.

###Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

A detailed explanation can be found in this [document][commit-message-format].

[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#
[github]: https://github.com/martinmicunda/mm-angular-exception-handler
[pulls]: https://github.com/martinmicunda/mm-angular-exception-handler/pulls
[ngDocs]: https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation
[unit-testing]: https://docs.angularjs.org/guide/unit-testing
