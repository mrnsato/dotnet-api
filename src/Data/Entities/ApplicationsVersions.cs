
namespace  dotnet_api.Data.Entities
{
    public class ApplicationVersion {
        public int ID { get; set; }
        public int ApplicationId { get; set; }
        public int VersionId { get; set; }

        public Application Application { get; set; } = null!;
        public Version Version { get; set; } = null!;
    }
}