import re

with open('frontend/app/document-analyzer/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_handle_analyze = '''  const handleAnalyze = async () => {
    if (!docText.trim() && !fileName) return;

    setAnalyzing(true);
    try {
      const { getIdToken } = await import('@/lib/auth');
      const { apiFetch } = await import('@/lib/api');
      
      const res = await apiFetch('/platform/analyze-document', {
        method: 'POST',
        body: { text: docText, filename: fileName || '' }
      });
      
      if (res.error) throw new Error(res.error);
      setAnalysisResult(res);
    } catch (e) {
      console.error(e);
      alert('Failed to analyze document. Please ensure you are logged in and your connection is stable.');
    } finally {
      setAnalyzing(false);
    }
  };'''

old_handle_analyze = re.search(r'const handleAnalyze = \(\) => \{.*?\n  \};', content, re.DOTALL)
if old_handle_analyze:
    content = content.replace(old_handle_analyze.group(0), new_handle_analyze)
    with open('frontend/app/document-analyzer/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated handleAnalyze to make actual API calls!")
else:
    print("Could not find handleAnalyze")
