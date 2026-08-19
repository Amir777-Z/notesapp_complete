import React, { useContext } from "react";
import { ButtonClickContext } from "../contexts/ButtonClickContext.tsx";

export function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
    const pages = [];
    pages.push(<button key="first" className="first" name="first" disabled={currentPage == 1} value={1} onClick={(e) => onClick(e)}>First</button>);
    pages.push(<button key="prev" className="previous" name="previous" disabled={currentPage == 1} value={currentPage - 1} onClick={(e) => onClick(e)}>Previous</button>)
    if (totalPages <= 5) {
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
            pages.push(<button key={i}
                value={i}
                disabled={i == currentPage}
                name={"page-" + i.toString()}
                onClick={(e) => onClick(e)}
                className={`page-number ${i === currentPage ? 'active' : ''}`}
            >{`Page no ${i}`}</button>);
        }
    }
    else if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
            pages.push(<button key={i}
                value={i}
                disabled={i == currentPage}
                name={"page-" + i.toString()}
                onClick={(e) => onClick(e)}
                className={`page-number ${i === currentPage ? 'active' : ''}`}
            >{`Page no ${i}`}</button>);
        }
    }
    else {
        if (currentPage >= totalPages - 2) {
            for (let i = totalPages - 4; i <= totalPages; i++) {
                pages.push(<button key={i}
                    value={i}
                    disabled={i == currentPage}
                    name={"page-" + i.toString()}
                    onClick={(e) => onClick(e)}
                    className={`page-number ${i === currentPage ? 'active' : ''}`}
                >{`Page no ${i}`}</button>);
            }
        }
        else {
            for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                pages.push(<button key={i}
                    value={i}
                    disabled={i == currentPage}
                    name={"page-" + i.toString()}
                    onClick={(e) => onClick(e)}
                    className={`page-number ${i === currentPage ? 'active' : ''}`}
                >{`Page no ${i}`}</button>);
            }
        }
    }
    pages.push(<button className="next" key="next" name="next" disabled={currentPage >= totalPages} value={currentPage + 1} onClick={(e) => onClick(e)}>Next</button>)
    pages.push(<button className="last" key="last" name="last" value={totalPages} disabled={currentPage >= totalPages} onClick={(e) => onClick(e)}>Last</button>)
    const handleClick = useContext(ButtonClickContext)
    function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        const pageToMoveTo = parseInt(event.currentTarget.value);
        if (pageToMoveTo == currentPage || pageToMoveTo < 1 || pageToMoveTo > totalPages)
            return;
        handleClick(pageToMoveTo);
    }
    return (
        <>
            <div>{pages}</div>
        </>

    );
}