interface BubbleUpProps {
    contents: string[];
}

const BubbleUp = (props: BubbleUpProps) => {
    return (
        <div className="absolute right-2 top-3 animate-bubbleUp bg-black bg-opacity-70 text-xl font-extrabold text-green">
            {props.contents.map((transaction, index) => (
                <p key={index}>{transaction}</p>
            ))}
        </div>
    );
};
export default BubbleUp;
