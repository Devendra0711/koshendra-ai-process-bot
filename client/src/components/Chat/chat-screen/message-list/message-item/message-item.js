import { computed, ref } from 'vue';

export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const bubbleRef = ref(null);
    const copied = ref(false);
    const feedback = ref(null);

    // Copy response to clipboard
    async function copyResponse() {
      try {
        await navigator.clipboard.writeText(props.message.content);
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }

    // Send feedback
    function sendFeedback(type) {
      feedback.value = feedback.value === type ? null : type;
      // TODO: Send to backend for analytics
      console.log('Feedback:', type, 'for message:', props.message._id);
    }

    // Share message
    async function shareMessage() {
      const shareText = props.message.content;
      const shareUrl = window.location.href;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Shared from AI Process Bot',
            text: shareText,
            url: shareUrl
          });
        } catch (err) {
          console.log('Share cancelled');
        }
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(`${shareText}\n\nShared from: ${shareUrl}`);
        alert('Link copied to clipboard!');
      }
    }

    // Simple markdown parser
    function parseMarkdown(text) {
      if (!text) return '';
      
      let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      // Code blocks
      html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre class="code-block"><code>${code.trim()}</code></pre>`;
      });
      
      // Images
      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="chat-image" />');
      
      // Links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="chat-link">$1</a>');
      
      // Bold
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
      
      // Italic
      html = html.replace(/(?<!\n)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
      
      // Inline code
      html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
      
      // Headers
      html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
      html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
      html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>');
      
      // Horizontal rule
      html = html.replace(/^---$/gm, '<hr />');
      
      // Process lists and tables
      const lines = html.split('\n');
      let inUl = false;
      let inOl = false;
      let inTable = false;
      const processed = [];
      
      for (let line of lines) {
        if (line.includes('<pre') || line.includes('</pre>')) {
          processed.push(line);
          continue;
        }
        
        const tableMatch = line.match(/^\|(.+)\|$/);
        const tableSeparator = line.match(/^\|[\s-:|]+\|$/);
        
        if (tableMatch && !tableSeparator) {
          if (!inTable) {
            processed.push('<table class="chat-table">');
            inTable = true;
            const cells = tableMatch[1].split('|').map(c => c.trim());
            processed.push('<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>');
          } else {
            const cells = tableMatch[1].split('|').map(c => c.trim());
            processed.push('<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>');
          }
          continue;
        } else if (tableSeparator) {
          continue;
        } else if (inTable && !tableMatch) {
          processed.push('</tbody></table>');
          inTable = false;
        }
        
        const bulletMatch = line.match(/^[\s]*[-*•][\s]+(.+)$/);
        const numberMatch = line.match(/^[\s]*(\d+)[.)]\s+(.+)$/);
        
        if (bulletMatch) {
          if (!inUl) { processed.push('<ul>'); inUl = true; }
          processed.push(`<li>${bulletMatch[1]}</li>`);
        } else if (numberMatch) {
          if (!inOl) { processed.push('<ol>'); inOl = true; }
          processed.push(`<li>${numberMatch[2]}</li>`);
        } else {
          if (inUl) { processed.push('</ul>'); inUl = false; }
          if (inOl) { processed.push('</ol>'); inOl = false; }
          processed.push(line);
        }
      }
      
      if (inUl) processed.push('</ul>');
      if (inOl) processed.push('</ol>');
      if (inTable) processed.push('</tbody></table>');
      
      return processed.join('<br>')
        .replace(/<br><ul>/g, '<ul>')
        .replace(/<\/ul><br>/g, '</ul>')
        .replace(/<br><ol>/g, '<ol>')
        .replace(/<\/ol><br>/g, '</ol>')
        .replace(/<br><li>/g, '<li>')
        .replace(/<\/li><br>/g, '</li>')
        .replace(/<br><table/g, '<table')
        .replace(/<\/table><br>/g, '</table>')
        .replace(/<br><thead>/g, '<thead>')
        .replace(/<br><tbody>/g, '<tbody>')
        .replace(/<br><tr>/g, '<tr>')
        .replace(/<\/tr><br>/g, '</tr>')
        .replace(/<br><h/g, '<h')
        .replace(/<\/h(\d)><br>/g, '</h$1>')
        .replace(/<br><hr \/><br>/g, '<hr />')
        .replace(/<br><pre/g, '<pre')
        .replace(/<\/pre><br>/g, '</pre>');
    }

    const formattedContent = computed(() => {
      return parseMarkdown(props.message.content);
    });

    return {
      bubbleRef,
      formattedContent,
      copied,
      feedback,
      copyResponse,
      sendFeedback,
      shareMessage
    };
  }
};
