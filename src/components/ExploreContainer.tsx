import "../theme/ExploreContainer.css"

interface ContainerProps {
  name: string
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="container">
      <strong>{name}</strong>
      <p>Place markers on the map, to get locations in this tab</p>
    </div>
  )
}

export default ExploreContainer
