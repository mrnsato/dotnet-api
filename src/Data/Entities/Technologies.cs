
namespace  dotnet_api.Data.Entities

{
    public class Technology {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public ICollection<Version> Versions { get; set; } = new List<Version>();
    }
}
