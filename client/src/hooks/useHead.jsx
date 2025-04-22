import { useEffect } from "react";

function useHead(title,description) {
    
    function metaDescription(content) {
        let meta = document.querySelector('meta[name="description"]');
        
        if(meta) {
            meta.setAttribute("content", content);
        } else {
            meta = document.createElement('meta');
            meta.name = "description";
            meta.content = content;
        
            document.head.appendChild(meta);
        }
    }
    
	useEffect(() => {
		document.title = title + " | Roméo";
		metaDescription(description);
	}, [title,description]);

}

export default useHead;
