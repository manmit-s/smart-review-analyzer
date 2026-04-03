import re

with open('frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update state
state_pattern = r"const \[reviews, setReviews\] = useState\(\[\]\);"
state_replacement = """const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const limit = 5;"""
content = re.sub(state_pattern, state_replacement, content)

# 2. Update useEffect dependency array
use_effect_pattern = r"fetchReviews\(\);\n  \}, \[\]\);"
use_effect_replacement = """fetchReviews();
  }, [currentPage]);"""
content = re.sub(use_effect_pattern, use_effect_replacement, content)

# 3. Update fetchReviews logic
fetch_pattern = r"const fetchReviews = async \(\) => \{\n\s+try \{\n\s+const res = await fetch\(\"http://localhost:8000/api/reviews\?limit=5\"\);\n\s+if \(res\.ok\) \{\n\s+const data = await res\.json\(\);\n\s+setReviews\(data\);\n\s+\}\n\s+\} catch \(e\) \{\n\s+console\.error\(e\);\n\s+\}\n\s+\};"
fetch_replacement = """const fetchReviews = async () => {
    try {
      const skip = (currentPage - 1) * limit;
      const res = await fetch(`http://localhost:8000/api/reviews?limit=${limit}&skip=${skip}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.items);
        setTotalReviews(data.total);
      }
    } catch (e) {
      console.error(e);
    }
  };"""
content = re.sub(fetch_pattern, fetch_replacement, content)

# 4. Update pagination JSX
pagination_pattern = r"\{/\* Pagination \*/\}.*?</div>\s*</div>"
pagination_replacement = """{/* Pagination */}
          <div className="flex justify-between items-center text-sm text-gray-500 mt-2 px-1">
            <div>Showing {Math.min((currentPage * limit), totalReviews)} of {totalReviews} extraction results</div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded bg-[#1C1B22] border border-[#2a2a35] flex items-center justify-center hover:bg-[#2a2a35] disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="h-8 px-4 rounded bg-[#625885] text-white flex items-center justify-center font-medium">
                Page {currentPage} of {Math.max(1, Math.ceil(totalReviews / limit))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalReviews / limit), p + 1))}
                disabled={currentPage >= Math.ceil(totalReviews / limit)}
                className="h-8 w-8 rounded bg-[#1C1B22] border border-[#2a2a35] flex items-center justify-center hover:bg-[#2a2a35] disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>"""
content = re.sub(pagination_pattern, pagination_replacement, content, flags=re.DOTALL)

with open('frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
