// const React = require("react");
// const PropTypes = require("prop-types");
// const hljs = require("highlight.js");

// class CodeBlock extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     this.setRef = this.setRef.bind(this);
//   }

//   setRef(el) {
//     this.codeEl = el;
//   }

//   componentDidMount() {
//     this.highlightCode();
//   }

//   componentDidUpdate() {
//     this.highlightCode();
//   }

//   highlightCode() {
//     hljs.highlightBlock(this.codeEl);
//   }

//   render() {
//     return (
//       <pre>
//         <code ref={this.setRef} className={`language-${this.props.language}`}>
//           {this.props.value}
//         </code>
//       </pre>
//     );
//   }
// }

// CodeBlock.defaultProps = {
//   language: "",
// };

// CodeBlock.propTypes = {
//   value: PropTypes.string.isRequired,
//   language: PropTypes.string,
// };

// export default CodeBlock
import React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {dracula} from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeBlock = {
  code({node, inline, className, children, ...props}) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
    <SyntaxHighlighter 
      style={dracula} 
      language={match[1]} 
      PreTag="div" {...props}>
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>

    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }
}

export default CodeBlock