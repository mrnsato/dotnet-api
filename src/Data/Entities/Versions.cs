
namespace dotnet_api.Data.Entities
{
    public class SoftwareVersion {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public int TechnologiesId { get; set; }
        public bool Standard { get; set; }
        public string FullName { get; set; } = string.Empty;
        public DateTime? EOS { get; set; }
        public DateTime? EOL { get; set; }

        public Technology Technology { get; set; } = null!;
        public ICollection<ApplicationVersion> ApplicationsVersions { get; set; } = new List<ApplicationVersion>();
    }
}