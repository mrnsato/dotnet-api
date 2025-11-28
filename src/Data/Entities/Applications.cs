
namespace  dotnet_api.Data.Entities
{
    public class Application {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool Active { get; set; }
        public ICollection<ApplicationVersion> ApplicationVersion { get; set; } = new List<ApplicationVersion>();
    }
}